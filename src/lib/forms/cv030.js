import { PDFDocument } from "pdf-lib";

export async function fillCV030(client, attorney, defendants, caseNumber) {
  const templateBytes = await fetch("/templates/california/CV-030.pdf").then(r => r.arrayBuffer());
  const pdf = await PDFDocument.load(templateBytes);
  const form = pdf.getForm();
  const today = new Date().toLocaleDateString("en-US");
  const defNames = defendants.map(d => d.name).join(", ");

  // ReadOnly + XFA flags stripped from template — short field names work now
  setText(form, "IMPORTANT_INFO[0]", attyBlock(attorney));
  setText(form, "FOR[0]",            "Plaintiff, " + client.name);
  setText(form, "PLANTIFF[0]",       client.name);
  setText(form, "DEFENDANTS[0]",     defNames);
  setText(form, "CASE_NUM[0]",       caseNumber || "");
  setText(form, "NAME[0]",           client.name);
  setText(form, "PARTY_S[0]",        "");
  setText(form, "CONNECTION[0]",     "");
  setText(form, "DATE[0]",           today);
  setText(form, "APPEARING[0]",      client.name);
  setText(form, "APPEARING[1]",      attorney?.name || "");

  form.flatten();
  return await pdf.save();
}

function setText(form, name, val) {
  try { form.getTextField(name).setText(val||""); }
  catch(e) { console.warn("CV030 setText:", name, e.message); }
}
function attyBlock(a) {
  if(!a) return "";
  return [a.name, a.firm, a.address, "Telephone: "+a.phone].filter(Boolean).join("\n");
}
