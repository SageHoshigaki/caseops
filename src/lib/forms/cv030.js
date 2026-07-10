import { PDFDocument } from "pdf-lib";

// Full XFA paths required by pdf-lib for this template
var P = "topmostSubform[0].Page1[0].";

export async function fillCV030(client, attorney, defendants, caseNumber) {
  var pdf  = await PDFDocument.load(await fetch("/templates/california/CV-030.pdf").then(function(r) { return r.arrayBuffer(); }));
  var form = pdf.getForm();
  var today = new Date().toLocaleDateString("en-US");

  // Attorney block — matches filed example: name (bar#), firm, address, telephone
  t(form, P + "IMPORTANT_INFO[0]", attyBlock(attorney));

  // "counsel of record for..."
  t(form, P + "FOR[0]", "Plaintiff, " + client.name);

  // Caption
  t(form, P + "PLANTIFF[0]",   client.name);
  t(form, P + "DEFENDANTS[0]", defendants.map(function(d) { return d.name; }).join(", "));

  // Case number
  t(form, P + "CASE_NUM[0]", caseNumber || "");

  // Interested parties table — plaintiff with no pecuniary interest
  t(form, P + "NAME[0]",       client.name);
  t(form, P + "PARTY_S[0]",    "Plaintiff");
  t(form, P + "CONNECTION[0]", "None");

  // Date
  t(form, P + "DATE[0]", today);

  // APPEARING[1] at Y=159 = signature line
  // APPEARING[0] at Y=80  = "attorney of record for" line (client name)
  t(form, P + "APPEARING[1]", attorney ? "/s/ " + attorney.name : "");
  t(form, P + "APPEARING[0]", client.name);

  form.flatten();
  return pdf.save();
}

function t(form, name, val) {
  try { form.getTextField(name).setText(val || ""); }
  catch(e) { console.warn("CV030 " + name.split(".").pop() + ": " + e.message); }
}

function attyBlock(a) {
  if (!a) return "";
  // Filed example format: name (bar#), firm, address, telephone
  var lines = [a.name];
  if (a.barNumber) lines[0] += " (" + a.barNumber + ")";
  lines.push(a.firm);
  lines.push(a.address);
  if (a.phone) lines.push("Telephone: " + a.phone);
  return lines.filter(Boolean).join("\n");
}
