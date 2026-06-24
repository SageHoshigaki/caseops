import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { LibraryPage } from "../components/library/LibraryPage.jsx";
import { Input, Textarea } from "../components/ui/index.jsx";
import { getViolations, saveViolation, deleteViolation } from "../lib/store.js";

const CATEGORY_COLORS = {
  "Federal Labor": "badge-blue",
  "CA Labor":      "badge-blue",
  "Civil Rights":  "badge-amber",
  "Tort":          "badge-rose",
  "Consumer":      "badge-green",
  "Contract":      "badge-ink",
};

export default function ViolationsPage() {
  const [violations, setViolations] = useState(getViolations);

  return (
    <LibraryPage
      title="Violations"
      subtitle="Saved statutes and claims — select multiples per packet"
      items={violations}
      onSave={data => setViolations(saveViolation(data))}
      onDelete={id  => setViolations(deleteViolation(id))}
      emptyIcon={AlertTriangle}
      searchKeys={["name", "code", "statute", "category"]}
      renderCard={(v) => (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={CATEGORY_COLORS[v.category] ?? "badge-ink"}>{v.category}</span>
            <span className="font-mono text-[10px] text-ink-300">{v.code}</span>
          </div>
          <div className="text-sm font-medium text-ink-800 mb-1 pr-10">{v.name}</div>
          <div className="text-xs text-ink-400 font-mono">{v.statute}</div>
          <div className="text-[11px] text-ink-300 mt-2 line-clamp-2">{v.description}</div>
        </div>
      )}
      renderForm={({ item, onSave }) => <ViolationForm item={item} onSave={onSave} />}
    />
  );
}

function ViolationForm({ item, onSave }) {
  const [form, setForm] = useState({
    name: "", code: "", statute: "", description: "", category: "Federal Labor",
    cv071Field: "", js44Field: "", ...item,
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form id="lib-form" className="space-y-4" onSubmit={e => { e.preventDefault(); onSave(form); }}>
      <Input label="Violation name *"  value={form.name}        onChange={set("name")}        required placeholder="FLSA Overtime Violation" />
      <Input label="Code / short ref"  value={form.code}        onChange={set("code")}        placeholder="FLSA-207" />
      <Input label="Statute *"         value={form.statute}     onChange={set("statute")}     required placeholder="29 U.S.C. § 207" />
      <Input label="Category"          value={form.category}    onChange={set("category")}    placeholder="Federal Labor" />
      <Textarea label="Description"    value={form.description} onChange={set("description")} rows={2} placeholder="Brief plain-language description" />
      <div className="pt-2 border-t border-ink-100">
        <p className="section-label mb-3">Form field mappings (optional)</p>
        <Input label="CV-071 checkbox field name" value={form.cv071Field} onChange={set("cv071Field")} placeholder="710 Fair Labor Standards" hint="Must match exact PDF field name." />
        <div className="mt-3">
          <Input label="JS44 checkbox field name" value={form.js44Field} onChange={set("js44Field")} placeholder="Check Box114" hint="Must match exact PDF field name." />
        </div>
      </div>
    </form>
  );
}
