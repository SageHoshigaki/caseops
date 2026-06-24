import { useState } from "react";
import { Users } from "lucide-react";
import { LibraryPage } from "../components/library/LibraryPage.jsx";
import { Input, Textarea } from "../components/ui/index.jsx";
import { getClients, saveClient, deleteClient } from "../lib/store.js";

export default function ClientsPage() {
  const [clients, setClients] = useState(getClients);

  function handleSave(data) {
    setClients(saveClient(data));
  }
  function handleDelete(id) {
    setClients(deleteClient(id));
  }

  return (
    <LibraryPage
      title="Clients"
      subtitle="People your firm represents"
      items={clients}
      onSave={handleSave}
      onDelete={handleDelete}
      emptyIcon={Users}
      searchKeys={["name", "email", "phone", "county"]}
      renderCard={(c) => (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-blue-600">
                {c.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-ink-800 truncate">{c.name}</div>
              <div className="text-xs text-ink-400">{c.county} County</div>
            </div>
          </div>
          <div className="space-y-0.5 text-xs text-ink-500">
            <div>{c.phone}</div>
            <div className="truncate">{c.email}</div>
            <div className="text-ink-300 truncate">{c.address}</div>
          </div>
          {c.notes && (
            <div className="mt-2 text-[11px] text-ink-300 line-clamp-2 border-t border-ink-50 pt-2">
              {c.notes}
            </div>
          )}
        </div>
      )}
      renderForm={({ item, onSave }) => (
        <ClientForm item={item} onSave={onSave} />
      )}
    />
  );
}

function ClientForm({ item, onSave }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", county: "", notes: "", ...item,
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form
      id="lib-form"
      className="space-y-4"
      onSubmit={e => { e.preventDefault(); onSave(form); }}
    >
      <Input label="Full name *"    value={form.name}    onChange={set("name")}    required placeholder="Jane Smith" />
      <Input label="Phone"          value={form.phone}   onChange={set("phone")}   placeholder="(213) 555-0100" />
      <Input label="Email"          value={form.email}   onChange={set("email")}   placeholder="jane@email.com" type="email" />
      <Input label="Address"        value={form.address} onChange={set("address")} placeholder="123 Main St, Los Angeles CA 90001" />
      <Input label="County *"       value={form.county}  onChange={set("county")}  required placeholder="Los Angeles" hint="Used on CV-071 and JS44 cover sheets." />
      <Textarea label="Notes"       value={form.notes}   onChange={set("notes")}   rows={3} placeholder="Case background, key dates…" />
    </form>
  );
}
