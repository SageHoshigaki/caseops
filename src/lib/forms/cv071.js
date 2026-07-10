import { PDFDocument } from "pdf-lib";

export async function fillCV071(client, attorney, defendants, violations, pkt) {
  const pdf  = await PDFDocument.load(await fetch("/templates/california/CV-071.pdf").then(r => r.arrayBuffer()));
  const form = pdf.getForm();
  const today = new Date().toLocaleDateString("en-US");

  // Section I — Parties
  t(form, "I a PLAINTIFFS   Check box if you are representing yourself",          client.name);
  t(form, "DEFENDANTS  Check box if you are representing yourself",               defendants.map(d => d.name).join(", "));
  t(form, "b County of Residence of First Listed Plaintiff",                      client.county || "");
  t(form, "County of Residence of First Listed Defendant",                        defendants[0]?.county || "");
  // Attorney block — filed example shows firm, address only (no attorney name, no phone)
  t(form, "c Attorneys Firm Name Address and Telephone Number  If you are representing yourself provide the same information", attyBlock(attorney));
  t(form, "Attorneys Firm Name Address and Telephone Number  If you are representing yourself provide the same information", "");

  // Section II — Federal Question
  c(form, "3 Federal Question US");

  // Section IV — Original Proceeding
  r(form, "Origin", "Original Proceeding");

  // Section V — Jury demand YES, Class Action No
  r(form, "V REQUESTED IN COMPLAINT  JURY DEMAND", "Yes");
  r(form, "CLASS ACTION under FRCvP 23",           "No_2");
  t(form, "Amount Demanded",                        pkt.amountDemanded || "");

  // Lemon Law — No
  r(form, "VI_choice", "Choice2");

  // Section VI — Cause of action
  t(form, "VII NATURE OF SUIT Place an X in one box only",
    violations.map(v => v.description || v.statute).join("; "));

  // Section VII — Nature of Suit checkboxes
  for (var i = 0; i < violations.length; i++) {
    if (violations[i].cv071Field) c(form, violations[i].cv071Field);
  }

  // Page 2 — Venue
  r(form, "from state court",          "No_3");
  r(form, "PLAINTIFF in this action",  "No_4");
  r(form, "DEFENDANT in this action",  "No_5");
  r(form, "If yes your case will initially be assigned to the", "No_7");
  r(form, "D2  Is there at least one answer in Column B",       "No_6");
  try { form.getDropdown("Initial Division in CACD").select(pkt.cacdDivision || "Western"); }
  catch(e) { console.warn("CV071 Division dropdown:", e.message); }
  r(form, "undefined_14", "No_8");

  // Page 3
  r(form, "undefined_15", "NO");
  r(form, "IXb RELATED CASES  Is this case related as defined below to any civil or criminal cases previously filed in this court", "NO_2");
  r(form, "X STATEWIDE OR NATIONWIDE RELIEF  Does this case seek to bar or mandate enforcement of a state or federal law and seek declaratory", "NO_3");

  // Signature + date (CDCA filed example includes /s/ signature)
  t(form, "Notice to CounselParties  The submission of this Civil Cover Sheet is required by Local Rule 31  This Form CV71 and the information contained herein",
    attorney ? "/s/ " + attorney.name : "");
  t(form, "Date7_af_date", today);

  form.flatten();
  return pdf.save();
}

function t(form, name, val) {
  try { form.getTextField(name).setText(val || ""); }
  catch(e) { console.warn("CV071 " + name.slice(0,40) + ": " + e.message); }
}
function c(form, name) {
  try { form.getCheckBox(name).check(); }
  catch(e) { console.warn("CV071 check " + name + ": " + e.message); }
}
function r(form, name, val) {
  try { form.getRadioGroup(name).select(val); }
  catch(e) { console.warn("CV071 radio " + name.slice(0,40) + "=" + val + ": " + e.message); }
}

function attyBlock(a) {
  if (!a) return "";
  // CDCA filed example format: firm, address, phone
  var lines = [a.firm, a.address];
  if (a.phone) lines.push("Telephone: " + a.phone);
  return lines.filter(Boolean).join("\n");
}
