import { PDFDocument } from "pdf-lib";

// Exact option strings from the PDF (leading spaces are intentional)
const DIST_OPTIONS = {
  california: "         Central District of California",
  georgia:    "       Northern District of Georgia ",
};

export async function fillAO440(districtId, client, attorney, defendant, caseNumber) {
  const templatePath = districtId === "california"
    ? "/templates/california/ao440.pdf"
    : "/templates/georgia/ao440.pdf";
  const templateBytes = await fetch(templatePath).then(r => r.arrayBuffer());
  const pdf = await PDFDocument.load(templateBytes);
  const form = pdf.getForm();
  const today = new Date().toLocaleDateString("en-US");

  // District dropdown — field name is "Info", options have exact padded spacing
  try {
    form.getDropdown("Info").select(DIST_OPTIONS[districtId] || "");
  } catch(e) { console.warn("AO440: Info dropdown failed:", e.message); }

  setText(form, "Plaintiff",           client.name);
  setText(form, "Defendant",           defendant.name);
  setText(form, "Civil action number", caseNumber || "");
  setText(form, "Defendant address",   defendant.serviceAddress || "");
  setText(form, "Plaintiff address",   attyBlock(attorney));
  setText(form, "Date_Today",          today);
  setText(form, "Defendant2",          defendant.name);

  form.flatten();
  return await pdf.save();
}

function setText(form, name, val) {
  try { form.getTextField(name).setText(val||""); }
  catch(e) { console.warn("AO440 setText:", name, e.message); }
}
function attyBlock(a) {
  if(!a) return "";
  return [a.name, a.firm, a.address, a.phone].filter(Boolean).join("\n");
}
