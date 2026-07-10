import Dexie from "dexie";

const db = new Dexie("CaseOps");

db.version(1).stores({
  clients:    "id, name, county",
  attorneys:  "id, name, firm",
  defendants: "id, name, type, county",
  violations: "id, name, code, category",
  packets:    "id, clientId, district, status",
});

export default db;
