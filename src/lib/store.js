const KEYS = { clients:"co_clients", attorneys:"co_attorneys", defendants:"co_defendants", violations:"co_violations", packets:"co_packets" };
function load(key, fb) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch { return fb; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

export function getClients() { return load(KEYS.clients, SEED.clients); }
export function saveClient(c) { const all=getClients(); const idx=all.findIndex(x=>x.id===c.id); const item=idx>=0?c:{...c,id:uid(),createdAt:new Date().toISOString()}; if(idx>=0)all[idx]=item; else all.push(item); save(KEYS.clients,all); return all; }
export function deleteClient(id) { const all=getClients().filter(x=>x.id!==id); save(KEYS.clients,all); return all; }

export function getAttorneys() { return load(KEYS.attorneys, SEED.attorneys); }
// Attorneys can work multiple districts — district field is now an array
export function getAttorneysByDistrict(d) { return getAttorneys().filter(a => Array.isArray(a.district) ? a.district.includes(d) : a.district === d); }
export function saveAttorney(a) { const all=getAttorneys(); const idx=all.findIndex(x=>x.id===a.id); const item=idx>=0?a:{...a,id:uid()}; if(idx>=0)all[idx]=item; else all.push(item); save(KEYS.attorneys,all); return all; }
export function deleteAttorney(id) { const all=getAttorneys().filter(x=>x.id!==id); save(KEYS.attorneys,all); return all; }

export function getDefendants() { return load(KEYS.defendants, SEED.defendants); }
export function saveDefendant(d) { const all=getDefendants(); const idx=all.findIndex(x=>x.id===d.id); const item=idx>=0?d:{...d,id:uid()}; if(idx>=0)all[idx]=item; else all.push(item); save(KEYS.defendants,all); return all; }
export function deleteDefendant(id) { const all=getDefendants().filter(x=>x.id!==id); save(KEYS.defendants,all); return all; }

export function getViolations() { return load(KEYS.violations, SEED.violations); }
export function saveViolation(v) { const all=getViolations(); const idx=all.findIndex(x=>x.id===v.id); const item=idx>=0?v:{...v,id:uid()}; if(idx>=0)all[idx]=item; else all.push(item); save(KEYS.violations,all); return all; }
export function deleteViolation(id) { const all=getViolations().filter(x=>x.id!==id); save(KEYS.violations,all); return all; }

export function getPackets() { return load(KEYS.packets, []); }
export function savePacket(p) { const all=getPackets(); const idx=all.findIndex(x=>x.id===p.id); if(idx>=0)all[idx]=p; else all.push(p); save(KEYS.packets,all); return all; }
export function deletePacket(id) { const all=getPackets().filter(x=>x.id!==id); save(KEYS.packets,all); return all; }
export function blankPacket() { return { id:uid(), clientId:"", district:"", attorneyId:"", defendantIds:[], violationIds:[], caseNumber:"", amountDemanded:"", juryDemand:false, cacdDivision:"", status:"draft", createdAt:new Date().toISOString() }; }

export function resetAllData() { Object.values(KEYS).forEach(k => localStorage.removeItem(k)); window.location.reload(); }
window.resetAllData = resetAllData;

const SEED = {
  clients: [
    { id:"c1", name:"Qualaysia Hilton", phone:"", email:"", address:"", county:"", notes:"FCRA — Equifax", createdAt:"2024-01-10T00:00:00Z" },
    { id:"c2", name:"Rigoberto Loria",  phone:"", email:"", address:"", county:"", notes:"FCRA — multiple defendants", createdAt:"2024-02-15T00:00:00Z" },
  ],
  attorneys: [
    { id:"a1", name:"Christopher F. Allen, Esq.", firm:"CF Allen Law, PC", address:"4355 Cobb Parkway SE, STE J269, Atlanta, GA 30339", phone:"213-291-9844", email:"", barNumber:"CBN: 321386", district:["california","georgia"] },
  ],
  defendants: [
    { id:"d1",  name:"Experian Information Solutions, Inc.",   type:"Corp", mainAddress:"475 Anton Blvd, Costa Mesa, CA 92626",                    serviceAddress:"c/o CT Corporation System\n330 N Brand Blvd\nGlendale, CA 91203",                               county:"Los Angeles", registeredAgent:"CT Corporation System", notes:"" },
    { id:"d2",  name:"Equifax Information Services, LLC",     type:"LLC",  mainAddress:"1550 Peachtree St NW, Atlanta, GA 30309",                 serviceAddress:"c/o The Prentice-Hall Corporation System, Inc.\n2710 Gateway Oaks Drive Ste 150N\nSacramento, CA 95833", county:"Fulton", registeredAgent:"The Prentice-Hall Corporation System, Inc.", notes:"" },
    { id:"d3",  name:"Trans Union, LLC",                      type:"LLC",  mainAddress:"555 W Adams St, Chicago, IL 60661",                       serviceAddress:"c/o CSC- Lawyers Incorporating Service\n2710 Gateway Oaks Drive\nSacramento, CA 95833",          county:"Cook", registeredAgent:"CSC- Lawyers Incorporating Service", notes:"" },
    { id:"d4",  name:"Barclays Bank Delaware",                type:"Corp", mainAddress:"100 S West St, Wilmington, DE 19801",                     serviceAddress:"c/o Corporation Service Company\n251 Little Falls Drive\nWilmington, DE 19808",                   county:"New Castle", registeredAgent:"Corporation Service Company", notes:"" },
    { id:"d5",  name:"Citibank, NA",                          type:"Corp", mainAddress:"388 Greenwich St, New York, NY 10013",                    serviceAddress:"c/o CT Corporation System\n28 Liberty St\nNew York, NY 10005",                                    county:"New York", registeredAgent:"CT Corporation System", notes:"" },
    { id:"d6",  name:"Global Federal Credit Union",           type:"Other",mainAddress:"4000 Credit Union Drive, Anchorage, AK 99503",            serviceAddress:"4000 Credit Union Drive\nAnchorage, AK 99503",                                                    county:"Anchorage", registeredAgent:"", notes:"" },
    { id:"d7",  name:"American Express National Bank",        type:"Corp", mainAddress:"200 Vesey St, New York, NY 10285",                        serviceAddress:"c/o CT Corporation System\n330 N Brand Blvd\nGlendale, CA 91203",                               county:"Los Angeles", registeredAgent:"CT Corporation System", notes:"" },
    { id:"d8",  name:"Bank of America, NA",                   type:"Corp", mainAddress:"100 N Tryon St, Charlotte, NC 28255",                     serviceAddress:"c/o CT Corporation System\n330 N Brand Blvd\nGlendale, CA 91203",                               county:"Los Angeles", registeredAgent:"CT Corporation System", notes:"" },
    { id:"d9",  name:"Cavalry Portfolio Services, LLC",       type:"LLC",  mainAddress:"500 Summit Lake Dr, Valhalla, NY 10595",                  serviceAddress:"c/o CT Corporation System\n330 N Brand Blvd\nGlendale, CA 91203",                               county:"Los Angeles", registeredAgent:"CT Corporation System", notes:"" },
    { id:"d10", name:"Synchrony Bank",                        type:"Corp", mainAddress:"950 Forrer Blvd, Dayton, OH 45420",                       serviceAddress:"c/o CT Corporation System\n330 N Brand Blvd\nGlendale, CA 91203",                               county:"Los Angeles", registeredAgent:"CT Corporation System", notes:"" },
    { id:"d11", name:"JPMorgan Chase Bank, NA",               type:"Corp", mainAddress:"383 Madison Ave, New York, NY 10179",                     serviceAddress:"c/o CT Corporation System\n330 N Brand Blvd\nGlendale, CA 91203",                               county:"Los Angeles", registeredAgent:"CT Corporation System", notes:"" },
    { id:"d12", name:"LVNV Funding, LLC",                     type:"LLC",  mainAddress:"2 Sun Court, Suite 400, Peachtree Corners, GA 30092",     serviceAddress:"c/o CSC- Lawyers Incorporating Service\n2710 Gateway Oaks Drive\nSacramento, CA 95833",          county:"Gwinnett", registeredAgent:"CSC- Lawyers Incorporating Service", notes:"" },
    { id:"d13", name:"Midland Credit Management, Inc.",       type:"Corp", mainAddress:"350 Camino De La Reina, San Diego, CA 92108",             serviceAddress:"c/o CSC- Lawyers Incorporating Service\n2710 Gateway Oaks Drive\nSacramento, CA 95833",          county:"San Diego", registeredAgent:"CSC- Lawyers Incorporating Service", notes:"" },
    { id:"d14", name:"Portfolio Recovery Associates, LLC",     type:"LLC",  mainAddress:"140 Corporate Blvd, Norfolk, VA 23502",                   serviceAddress:"c/o CSC- Lawyers Incorporating Service\n2710 Gateway Oaks Drive\nSacramento, CA 95833",          county:"Norfolk", registeredAgent:"CSC- Lawyers Incorporating Service", notes:"" },
    { id:"d15", name:"TD Bank, NA",                           type:"Corp", mainAddress:"1701 Route 70 E, Cherry Hill, NJ 08034",                  serviceAddress:"c/o CSC- Lawyers Incorporating Service\n2710 Gateway Oaks Drive\nSacramento, CA 95833",          county:"Camden", registeredAgent:"CSC- Lawyers Incorporating Service", notes:"" },
    { id:"d16", name:"Wells Fargo Bank, NA",                  type:"Corp", mainAddress:"420 Montgomery St, San Francisco, CA 94104",              serviceAddress:"c/o CSC- Lawyers Incorporating Service\n2710 Gateway Oaks Drive\nSacramento, CA 95833",          county:"San Francisco", registeredAgent:"CSC- Lawyers Incorporating Service", notes:"" },
    { id:"d17", name:"LVNV Funding dba Resurgent Capital Services, L.P.", type:"LP", mainAddress:"2 Sun Court, Suite 400, Peachtree Corners, GA 30092", serviceAddress:"c/o Corporation Service Company\n2 Sun Court, Suite 400\nPeachtree Corners, GA 30092",  county:"Gwinnett", registeredAgent:"Corporation Service Company", notes:"Georgia service address" },
  ],
  violations: [
    { id:"v1", name:"Fair Credit Reporting Act (FCRA)", code:"15 USC 1681", statute:"15 U.S.C. \u00a7\u00a7 1681 et seq.", description:"THE FAIR CREDIT REPORTING ACT, 15 U.S.C. \u00a7\u00a7 1681 et seq.", category:"Consumer", cv071Field:"480  Consumer Credit", js44Field:"Check Box99" },
    { id:"v2", name:"Fair Debt Collection Practices Act (FDCPA)", code:"15 USC 1692", statute:"15 U.S.C. \u00a7\u00a7 1692 et seq.", description:"THE FAIR DEBT COLLECTION PRACTICES ACT, 15 U.S.C. \u00a7\u00a7 1692 et seq.", category:"Consumer", cv071Field:"480  Consumer Credit", js44Field:"Check Box99" },
  ],
};
