import { PDFDocument } from "pdf-lib";

var DIST_OPTIONS = {
  california: "         Central District of California",
  georgia:    "       Northern District of Georgia ",
};

export async function fillAO440(districtId, client, attorney, defendant, caseNumber) {
  var path = districtId === "california"
    ? "/templates/california/ao440.pdf"
    : "/templates/georgia/ao440.pdf";

  var pdf  = await PDFDocument.load(await fetch(path).then(function(r) { return r.arrayBuffer(); }));
  var form = pdf.getForm();
  var today = new Date().toLocaleDateString("en-US");

  // District dropdown
  try { form.getDropdown("Dist.Info").select(DIST_OPTIONS[districtId]); }
  catch(e) { console.warn("AO440 Dist.Info:", e.message); }

  // Page 1 — party fields
  t(form, "Plaintiff",           client.name);
  t(form, "Defendant",           defendant.name);
  t(form, "Civil action number", caseNumber || "");
  t(form, "Date_Today",          today);

  // Defendant address: company name first line, then service address
  t(form, "Defendant address", defendant.name + "\n" + (defendant.serviceAddress || ""));

  // Attorney block — CDCA filed example: firm, name (bar#), address
  t(form, "Plaintiff address", attyBlock(districtId, attorney));

  // DO NOT fill page 2 fields — proof of service is untouched

  form.flatten();
  return pdf.save();
}

function t(form, name, val) {
  try { form.getTextField(name).setText(val || ""); }
  catch(e) { console.warn("AO440 " + name + ": " + e.message); }
}

function attyBlock(district, a) {
  if (!a) return "";
  if (district === "california") {
    // CDCA filed example: firm, name (bar#), address
    var lines = [a.firm];
    var nameLine = a.name;
    if (a.barNumber) nameLine += " (" + a.barNumber + ")";
    lines.push(nameLine);
    lines.push(a.address);
    return lines.filter(Boolean).join("\n");
  }
  // Georgia: name, firm, address, phone, email
  var lines = [a.name, a.firm, a.address];
  if (a.phone) lines.push("P: " + a.phone);
  if (a.email) lines.push("E: " + a.email);
  return lines.filter(Boolean).join("\n");
}
