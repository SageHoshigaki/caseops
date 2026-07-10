import { useState } from "react";
import { Briefcase, Mail, Phone, Scale, MapPin } from "lucide-react";
import { LibraryPage } from "../components/library/LibraryPage.jsx";
import { Input, Select, StatusPill } from "../components/ui/index.jsx";
import { getAttorneys, saveAttorney, deleteAttorney, bulkImportAttorneys } from "../lib/store.js";

const DISTRICT_LABELS = {
  california: "CACD — Central District of California",
  georgia: "NDGA — Northern District of Georgia",
};
const DISTRICT_SHORT = { california: "CACD", georgia: "NDGA" };

const CSV_FIELDS = [
  { key: "name",      label: "Full Name", required: true },
  { key: "firm",      label: "Firm Name", required: true },
  { key: "address",   label: "Office Address" },
  { key: "phone",     label: "Phone" },
  { key: "email",     label: "Email" },
  { key: "barNumber", label: "Bar Number" },
  { key: "district",  label: "District (california/georgia)" },
];

export default function AttorneysPage() {
  return (
    <LibraryPage
      title="Attorneys"
      subtitle="Counsel of record, filtered by district in the packet builder."
      loadItems={getAttorneys}
      onSave={saveAttorney}
      onDelete={deleteAttorney}
      onBulkImport={bulkImportAttorneys}
      emptyIcon={Briefcase}
      searchKeys={["name", "firm", "barNumber", "email", "phone"]}
      csvFields={CSV_FIELDS}
      renderCard={(attorney) => <AttorneyCard attorney={attorney} />}
      renderForm={({ item, onSave }) => <AttorneyForm item={item} onSave={onSave} />}
    />
  );
}

function AttorneyCard({ attorney }) {
  const distLabel = Array.isArray(attorney.district)
    ? attorney.district.map(d => DISTRICT_SHORT[d] || d).join(", ")
    : DISTRICT_SHORT[attorney.district] ?? "DIST";
  const distDesc = Array.isArray(attorney.district)
    ? attorney.district.map(d => DISTRICT_LABELS[d] || d).join(" & ")
    : DISTRICT_LABELS[attorney.district] ?? "Unassigned district";

  return (
    <div>
      <div className="mb-5 flex items-start gap-3">
        <div className="widget-icon shrink-0"><Briefcase size={16} /></div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">{attorney.name}</div>
          <div className="mt-1 truncate text-xs text-[#A9B7AF]">{attorney.firm}</div>
        </div>
      </div>
      <div className="space-y-2 rounded-2xl border border-[#102016] bg-black/35 p-3">
        {attorney.phone && <InfoLine icon={Phone} value={attorney.phone} />}
        {attorney.email && <InfoLine icon={Mail} value={attorney.email} />}
        {attorney.barNumber && <InfoLine icon={Scale} value={`Bar #${attorney.barNumber}`} mono />}
        {attorney.address && <InfoLine icon={MapPin} value={attorney.address} />}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#102016] pt-4">
        <StatusPill tone="success">{distLabel}</StatusPill>
        <span className="truncate pl-3 text-[11px] font-medium text-[#6F7D75]">{distDesc}</span>
      </div>
    </div>
  );
}

function InfoLine({ icon: Icon, value, mono = false }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#A9B7AF]">
      <Icon size={13} className="shrink-0 text-[#39FF88]" />
      <span className={mono ? "truncate font-mono text-[#6F7D75]" : "truncate"}>{value}</span>
    </div>
  );
}

function AttorneyForm({ item, onSave }) {
  const [form, setForm] = useState({
    name: "", firm: "", address: "", phone: "", email: "", barNumber: "", district: "california", ...item,
  });
  const set = (key) => (event) => setForm(cur => ({ ...cur, [key]: event.target.value }));
  return (
    <form id="lib-form" className="space-y-4" onSubmit={e => { e.preventDefault(); onSave(form); }}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Full name *" value={form.name} onChange={set("name")} required placeholder="Patricia Nguyen" />
        <Input label="Firm name *" value={form.firm} onChange={set("firm")} required placeholder="Nguyen & Holloway LLP" />
      </div>
      <Input label="Office address *" value={form.address} onChange={set("address")} required placeholder="633 W 5th St Ste 2800, Los Angeles CA 90071" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Phone *" value={form.phone} onChange={set("phone")} required placeholder="(213) 555-0210" />
        <Input label="Email" value={form.email} onChange={set("email")} placeholder="attorney@firm.com" type="email" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Bar number" value={form.barNumber} onChange={set("barNumber")} placeholder="CA284019" />
        <Select label="District *" value={form.district} onChange={set("district")} required>
          <option value="california">CACD — Central District of California</option>
          <option value="georgia">NDGA — Northern District of Georgia</option>
        </Select>
      </div>
    </form>
  );
}
