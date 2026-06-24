import { PDFDocument } from "pdf-lib";

export async function fillJS44(client, attorney, defendants, violations, pkt) {
  const templateBytes = await fetch("/templates/georgia/JS44_202409.pdf").then(r => r.arrayBuffer());
  const pdf = await PDFDocument.load(templateBytes);
  const form = pdf.getForm();
  const today = new Date().toLocaleDateString("en-US");
  const defNames = defendants.map(d => d.name).join(", ");

  // ── Section I — Parties ──────────────────────────────────────────
  setText(form, "Text1", client.name);
  setText(form, "Text2", defNames);
  setText(form, "Text3", client.county || "");
  setText(form, "Text4", defendants[0]?.county || "");
  setText(form, "Text5", attyBlock(attorney));
  setText(form, "Text6", ""); // defendant attorney — unknown

  // ── Section II — Federal Question ────────────────────────────────
  check(form, "Check Box13");

  // ── Section IV — Original Proceeding ─────────────────────────────
  // Check Box36 is a radio group (one child with /Yes option)
  radio(form, "Check Box36", "Yes");

  // ── Section V — Cause of action ──────────────────────────────────
  const causeText = violations.map(v => v.statute || v.description).join("; ");
  setText(form, "Text7", causeText);

  // Statewide relief → NO
  check(form, "Check Box300");

  // ── Nature of Suit checkboxes ─────────────────────────────────────
  for (const v of violations) {
    if (v.js44Field) check(form, v.js44Field);
  }

  // ── Section VII — Jury demand + amount ───────────────────────────
  setText(form, "Text8", pkt.amountDemanded || "");
  if (pkt.juryDemand) {
    check(form, "Check Box1"); // YES
  } else {
    check(form, "Check Box2"); // NO
  }

  // ── Related/Refiled cases — blank ────────────────────────────────
  setText(form, "Text9", "");
  setText(form, "Text10", "");

  // ── Signature + date ──────────────────────────────────────────────
  setText(form, "Text11",  attorney?.name || "");
  setText(form, "Text152", today);

  form.flatten();
  return await pdf.save();
}

function setText(form, name, val) {
  try { form.getTextField(name).setText(val||""); }
  catch(e) { console.warn("JS44 setText: field not found:", name); }
}

function check(form, name) {
  try { form.getCheckBox(name).check(); }
  catch(e) { console.warn("JS44 check: field not found:", name); }
}

function radio(form, name, optionValue) {
  try { form.getRadioGroup(name).select(optionValue); }
  catch(e) { console.warn("JS44 radio: field/option not found:", name, optionValue); }
}

function attyBlock(a) {
  if(!a) return "";
  return [a.name, a.firm, a.address, "P: "+a.phone+". E: "+(a.email||"")].filter(Boolean).join("\n");
}
