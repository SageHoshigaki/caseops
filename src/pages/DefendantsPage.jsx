import { useState } from "react";
import { Building2 } from "lucide-react";
import { LibraryPage } from "../components/library/LibraryPage.jsx";
import { Input, Select, Textarea } from "../components/ui/index.jsx";
import { getDefendants, saveDefendant, deleteDefendant } from "../lib/store.js";

export default function DefendantsPage() {
  const [defendants, setDefendants] = useState(getDefendants);

  return (
    <LibraryPage
      title="Defendants"
      subtitle="Companies and individuals being sued — saved for reuse"
      items={defendants}
      onSave={data => setDefendants(saveDefendant(data))}
      onDelete={id  => setDefendants(deleteDefendant(id))}
      emptyIcon={Building2}
      searchKeys={["name", "county", "registeredAgent"]}
      renderCard={(d) => (
        <div>
          <div className="flex items-start gap-2 mb-2 pr-10">
            <span className="badge-ink mt-0.5">{d.type}</span>
          </div>
          <div className="text-sm font-medium text-ink-800 mb-2">{d.name}</div>
          <div className="space-y-1 text-xs text-ink-400">
            <div>📍 {d.serviceAddress}</div>
            {d.registeredAgent && <div>🤝 {d.registeredAgent}</div>}
            {d.county && <div>🗺 {d.county} County</div>}
          </div>
          {d.notes && (
            <div className="mt-2 text-[11px] text-ink-300 line-clamp-2 border-t border-ink-50 pt-2">
              {d.notes}
            </div>
          )}
        </div>
      )}
      renderForm={({ item, onSave }) => <DefendantForm item={item} onSave={onSave} />}
    />
  );
}

function DefendantForm({ item, onSave }) {
  const [form, setForm] = useState({
    name: "", type: "LLC", mainAddress: "", serviceAddress: "", county: "", registeredAgent: "", notes: "", ...item,
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form id="lib-form" className="space-y-4" onSubmit={e => { e.preventDefault(); onSave(form); }}>
      <Input label="Company / individual name *" value={form.name} onChange={set("name")} required placeholder="Apex Property Management LLC" />
      <Select label="Entity type" value={form.type} onChange={set("type")}>
        <option>LLC</option>
        <option>Corp</option>
        <option>LP</option>
        <option>Individual</option>
        <option>Other</option>
      </Select>
      <Input label="Main address *"    value={form.mainAddress}    onChange={set("mainAddress")}    required placeholder="350 S Grand Ave, Los Angeles CA 90071" />
      <Input label="Service address *" value={form.serviceAddress} onChange={set("serviceAddress")} required placeholder="Same as main, or registered agent address" hint="Used on AO 440 Summons." />
      <Input label="County *"          value={form.county}         onChange={set("county")}         required placeholder="Los Angeles" hint="Used on CV-071 and JS44 cover sheets." />
      <Input label="Registered agent"  value={form.registeredAgent} onChange={set("registeredAgent")} placeholder="CT Corporation System" />
      <Textarea label="Notes"          value={form.notes}          onChange={set("notes")}          rows={2} />
    </form>
  );
}
