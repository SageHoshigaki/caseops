import { fillAO440 } from "./forms/ao440.js";
import { fillCV030 } from "./forms/cv030.js";
import { fillCV071 } from "./forms/cv071.js";
import { fillJS44 }  from "./forms/js44.js";
import JSZip from "jszip";

export async function generatePacketFiles(client, attorney, defendants, violations, pkt) {
  const files = [];
  const slug = client.name.replace(/\s+/g, "_");

  if (pkt.district === "california") {
    for (let i = 0; i < defendants.length; i++) {
      const suf = defendants.length > 1 ? "_" + (i+1) : "";
      const ds = defendants[i].name.replace(/\s+/g,"_").slice(0,30);
      files.push({ name: slug+"/AO440_Summons"+suf+"_"+ds+".pdf", bytes: await fillAO440("california", client, attorney, defendants[i], pkt.caseNumber) });
    }
    files.push({ name: slug+"/CV030_Interested_Parties.pdf", bytes: await fillCV030(client, attorney, defendants, pkt.caseNumber) });
    files.push({ name: slug+"/CV071_Civil_Cover_Sheet.pdf",  bytes: await fillCV071(client, attorney, defendants, violations, pkt) });
  } else if (pkt.district === "georgia") {
    for (let i = 0; i < defendants.length; i++) {
      const suf = defendants.length > 1 ? "_" + (i+1) : "";
      const ds = defendants[i].name.replace(/\s+/g,"_").slice(0,30);
      files.push({ name: slug+"/AO440_Summons"+suf+"_"+ds+".pdf", bytes: await fillAO440("georgia", client, attorney, defendants[i], pkt.caseNumber) });
    }
    files.push({ name: slug+"/JS44_Civil_Cover_Sheet.pdf", bytes: await fillJS44(client, attorney, defendants, violations, pkt) });
  }
  return files;
}

export async function downloadAllAsZip(allFiles, zipName = "CaseOps_Packets.zip") {
  const zip = new JSZip();
  for (const file of allFiles) zip.file(file.name, file.bytes);
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = zipName;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
