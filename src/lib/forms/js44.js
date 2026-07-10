import { PDFDocument } from "pdf-lib";

export async function fillJS44(client, attorney, defendants, violations, pkt) {
  const pdf  = await PDFDocument.load(await fetch("/templates/georgia/JS44_202409.pdf").then(r => r.arrayBuffer()));
  const form = pdf.getForm();
  const today = new Date().toLocaleDateString("en-US");

  // Section I — Parties
  t(form, "Text10", client.name);
  t(form, "Text11", defendants.map(d => d.name).join(", "));
  t(form, "Text8",  client.county || "");
  t(form, "Text9",  defendants[0]?.county || "");
  t(form, "Text6",  attyBlock(attorney));
  t(form, "Text7",  "");

  // Section II — Federal Question
  c(form, "Check Box14");

  // Section IV — Original Proceeding
  c(form, "Check Box28");

  // Section V — Cause of action
  t(form, "Text5", violations.map(d => d.description || d.statute).join("; "));

  // Statewide relief — NO
  c(form, "Check Box2");

  // Section VI — Nature of Suit
  for (var i = 0; i < violations.length; i++) {
    if (violations[i].js44Field) c(form, violations[i].js44Field);
  }

  // Section VII — Jury demand YES always
  t(form, "Text4", pkt.amountDemanded || "");
  c(form, "Check Box141");

  // Section VIII — leave blank
  t(form, "Text1", "");
  t(form, "Text2", "");

  // Date only — do NOT sign attorney name
  t(form, "Text152", today);

  form.flatten();
  return pdf.save();
}

function t(form, name, val) {
  try { form.getTextField(name).setText(val || ""); }
  catch(e) { console.warn("JS44 " + name + ": " + e.message); }
}

function c(form, name) {
  try { form.getCheckBox(name).check(); }
  catch(e) { console.warn("JS44 check " + name + ": " + e.message); }
}

function attyBlock(a) {
  if (!a) return "";
  var lines = [a.name, a.firm, a.address];
  if (a.phone) lines.push("P: " + a.phone);
  if (a.email) lines.push("E: " + a.email);
  return lines.filter(Boolean).join("\n");
}
