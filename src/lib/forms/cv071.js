import { PDFDocument } from "pdf-lib";

export async function fillCV071(client, attorney, defendants, violations, pkt) {
  const templateBytes = await fetch("/templates/california/CV-071.pdf").then(r => r.arrayBuffer());
  const pdf = await PDFDocument.load(templateBytes);
  const form = pdf.getForm();
  const today = new Date().toLocaleDateString("en-US");
  const defNames = defendants.map(d => d.name).join(", ");

  // ── Section I — Parties ──────────────────────────────────────────
  setText(form, "I a PLAINTIFFS   Check box if you are representing yourself", client.name);
  setText(form, "DEFENDANTS  Check box if you are representing yourself", defNames);
  setText(form, "b County of Residence of First Listed Plaintiff", client.county || "");
  setText(form, "County of Residence of First Listed Defendant", defendants[0]?.county || "");
  setText(form, "c Attorneys Firm Name Address and Telephone Number  If you are representing yourself provide the same information", attyBlock(attorney));

  // ── Section II — Federal Question ───────────────────────────────
  check(form, "3 Federal Question US");

  // ── Section IV — Origin ──────────────────────────────────────────
  // Pre-baked into template as "Original Proceeding" — no action needed.
  // pdf-lib flattening will preserve the template value.

  // ── Section V — Jury demand ──────────────────────────────────────
  // Only select YES if explicitly set — template default leaves it unchecked
  if (pkt.juryDemand === true) {
    radio(form, "V REQUESTED IN COMPLAINT  JURY DEMAND", "Yes");
  }
  setText(form, "Amount Demanded", pkt.amountDemanded || "");

  // ── Lemon Law — pre-baked NO in template, no action needed ───────

  // ── Section VI — Cause of action ─────────────────────────────────
  const causeText = violations.map(v => v.description || v.statute).join("; ");
  setText(form, "VII NATURE OF SUIT Place an X in one box only", causeText);

  // ── Section VII — Nature of Suit checkboxes ──────────────────────
  for (const v of violations) {
    if (v.cv071Field) check(form, v.cv071Field);
  }

  // ── Page 2 — Venue radio buttons ─────────────────────────────────
  radio(form, "from state court",         "No_3");
  radio(form, "PLAINTIFF in this action", "No_4");
  radio(form, "DEFENDANT in this action", "No_5");
  radio(form, "D2  Is there at least one answer in Column B", "No_6");

  if (pkt.cacdDivision) {
    try { form.getDropdown("Initial Division in CACD").select(pkt.cacdDivision); }
    catch(e) { console.warn("CV071: Division dropdown failed:", e.message); }
  }

  radio(form, "undefined_14", "No_8"); // Q.F → NO

  // ── Page 3 ───────────────────────────────────────────────────────
  radio(form, "undefined_15", "NO");
  radio(form, "IXb RELATED CASES  Is this case related as defined below to any civil or criminal cases previously filed in this court", "NO_2");
  radio(form, "X STATEWIDE OR NATIONWIDE RELIEF  Does this case seek to bar or mandate enforcement of a state or federal law and seek declaratory", "NO_3");

  setText(form, "Date7_af_date", today);

  form.flatten();
  return await pdf.save();
}

function setText(form, name, val) {
  try { form.getTextField(name).setText(val||""); }
  catch(e) { console.warn("CV071 setText:", name, e.message); }
}
function check(form, name) {
  try { form.getCheckBox(name).check(); }
  catch(e) { console.warn("CV071 check:", name, e.message); }
}
function radio(form, name, val) {
  try { form.getRadioGroup(name).select(val); }
  catch(e) { console.warn("CV071 radio:", name, val, e.message); }
}
function attyBlock(a) {
  if(!a) return "";
  return [a.firm, a.name, a.address, a.phone].filter(Boolean).join("\n");
}
