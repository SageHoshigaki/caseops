import db from "./db.js";

// ─── ID generator ───────────────────────────────────────────────────────────
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// ─── Seed data (only used on first run) ─────────────────────────────────────
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
    { id:"v1", name:"Fair Credit Reporting Act (FCRA)", code:"15 USC 1681", statute:"15 U.S.C. \u00a7\u00a7 1681 et seq.", description:"THE FAIR CREDIT REPORTING ACT, 15 U.S.C. \u00a7\u00a7 1681 et seq.", category:"Consumer", cv071Field:"480  Consumer Credit", js44Field:"Check Box129" },
    { id:"v2", name:"Fair Debt Collection Practices Act (FDCPA)", code:"15 USC 1692", statute:"15 U.S.C. \u00a7\u00a7 1692 et seq.", description:"THE FAIR DEBT COLLECTION PRACTICES ACT, 15 U.S.C. \u00a7\u00a7 1692 et seq.", category:"Consumer", cv071Field:"480  Consumer Credit", js44Field:"Check Box129" },
  ],
};

// ─── Migration: localStorage → Dexie (one-time) ────────────────────────────
const LS_KEYS = { clients:"co_clients", attorneys:"co_attorneys", defendants:"co_defendants", violations:"co_violations", packets:"co_packets" };

async function migrateFromLocalStorage() {
  for (const [table, lsKey] of Object.entries(LS_KEYS)) {
    try {
      const raw = localStorage.getItem(lsKey);
      if (!raw) continue;
      const items = JSON.parse(raw);
      if (!Array.isArray(items) || items.length === 0) continue;
      const existing = await db[table].count();
      if (existing === 0) {
        await db[table].bulkPut(items);
        console.log(`Migrated ${items.length} ${table} from localStorage`);
      }
      localStorage.removeItem(lsKey);
    } catch (e) {
      console.warn(`Migration failed for ${table}:`, e);
    }
  }
}

// ─── Seed on first run ──────────────────────────────────────────────────────
async function seedIfEmpty() {
  for (const [table, items] of Object.entries(SEED)) {
    const count = await db[table].count();
    if (count === 0) {
      await db[table].bulkPut(items);
      console.log(`Seeded ${items.length} ${table}`);
    }
  }
}

// ─── Init (call once on app startup) ────────────────────────────────────────
let _initDone = false;
let _initPromise = null;

export function initStore() {
  if (_initPromise) return _initPromise;
  _initPromise = (async () => {
    if (_initDone) return;
    await migrateFromLocalStorage();
    await seedIfEmpty();
    _initDone = true;
  })();
  return _initPromise;
}

// ─── Clients ────────────────────────────────────────────────────────────────
export async function getClients() {
  await initStore();
  return db.clients.toArray();
}

export async function saveClient(c) {
  await initStore();
  if (!c.id) {
    c.id = uid();
    c.createdAt = new Date().toISOString();
  }
  await db.clients.put(c);
  return db.clients.toArray();
}

export async function deleteClient(id) {
  await db.clients.delete(id);
  return db.clients.toArray();
}

export async function bulkImportClients(rows) {
  const items = rows.map(r => ({ ...r, id: r.id || uid(), createdAt: r.createdAt || new Date().toISOString() }));
  await db.clients.bulkPut(items);
  return db.clients.toArray();
}

// ─── Attorneys ──────────────────────────────────────────────────────────────
export async function getAttorneys() {
  await initStore();
  return db.attorneys.toArray();
}

export async function getAttorneysByDistrict(d) {
  const all = await getAttorneys();
  return all.filter(a => Array.isArray(a.district) ? a.district.includes(d) : a.district === d);
}

export async function saveAttorney(a) {
  await initStore();
  if (!a.id) a.id = uid();
  await db.attorneys.put(a);
  return db.attorneys.toArray();
}

export async function deleteAttorney(id) {
  await db.attorneys.delete(id);
  return db.attorneys.toArray();
}

export async function bulkImportAttorneys(rows) {
  const items = rows.map(r => ({ ...r, id: r.id || uid() }));
  await db.attorneys.bulkPut(items);
  return db.attorneys.toArray();
}

// ─── Defendants ─────────────────────────────────────────────────────────────
export async function getDefendants() {
  await initStore();
  return db.defendants.toArray();
}

export async function saveDefendant(d) {
  await initStore();
  if (!d.id) d.id = uid();
  await db.defendants.put(d);
  return db.defendants.toArray();
}

export async function deleteDefendant(id) {
  await db.defendants.delete(id);
  return db.defendants.toArray();
}

export async function bulkImportDefendants(rows) {
  const items = rows.map(r => ({ ...r, id: r.id || uid() }));
  await db.defendants.bulkPut(items);
  return db.defendants.toArray();
}

// ─── Violations ─────────────────────────────────────────────────────────────
export async function getViolations() {
  await initStore();
  return db.violations.toArray();
}

export async function saveViolation(v) {
  await initStore();
  if (!v.id) v.id = uid();
  await db.violations.put(v);
  return db.violations.toArray();
}

export async function deleteViolation(id) {
  await db.violations.delete(id);
  return db.violations.toArray();
}

export async function bulkImportViolations(rows) {
  const items = rows.map(r => ({ ...r, id: r.id || uid() }));
  await db.violations.bulkPut(items);
  return db.violations.toArray();
}

// ─── Packets ────────────────────────────────────────────────────────────────
export async function getPackets() {
  await initStore();
  return db.packets.toArray();
}

export async function savePacket(p) {
  await initStore();
  if (!p.id) p.id = uid();
  await db.packets.put(p);
  return db.packets.toArray();
}

export async function deletePacket(id) {
  await db.packets.delete(id);
  return db.packets.toArray();
}

export function blankPacket() {
  return {
    id: uid(),
    clientId: "",
    district: "",
    attorneyId: "",
    defendantIds: [],
    violationIds: [],
    caseNumber: "",
    amountDemanded: "",
    juryDemand: false,
    cacdDivision: "",
    status: "draft",
    createdAt: new Date().toISOString(),
  };
}

// ─── Generic bulk import (used by CsvImportModal) ───────────────────────────
export async function bulkImport(tableName, rows) {
  const importFn = {
    clients: bulkImportClients,
    attorneys: bulkImportAttorneys,
    defendants: bulkImportDefendants,
    violations: bulkImportViolations,
  }[tableName];
  if (!importFn) throw new Error(`Unknown table: ${tableName}`);
  return importFn(rows);
}

// ─── Reset ──────────────────────────────────────────────────────────────────
export async function resetAllData() {
  await Promise.all([
    db.clients.clear(),
    db.attorneys.clear(),
    db.defendants.clear(),
    db.violations.clear(),
    db.packets.clear(),
  ]);
  Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k));
  window.location.reload();
}

window.resetAllData = resetAllData;
