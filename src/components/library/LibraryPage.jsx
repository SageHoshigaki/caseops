// Shared library layout: search + widget grid + modal form panel + CSV import
import { useState, useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { Search, Plus, Pencil, Trash2, Inbox, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, WidgetPanel, StatusPill } from "../ui/index.jsx";
import CsvImportModal from "../CsvImportModal.jsx";

const gridVariants = { animate: { transition: { staggerChildren: 0.055 } } };
const itemVariants = {
  initial:  { opacity: 0, y: 14, scale: 0.985 },
  animate:  { opacity: 1, y: 0,  scale: 1 },
};

export function LibraryPage({
  title,
  subtitle,
  loadItems,          // async () => items[]
  onSave,             // async (data) => items[]
  onDelete,           // async (id) => items[]
  onBulkImport,       // async (rows) => items[]   (for CSV)
  renderCard,
  renderForm,
  emptyIcon: EmptyIcon,
  searchKeys = ["name"],
  csvFields,          // [{ key, label, required? }] — if provided, shows Import CSV button
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [csvOpen, setCsvOpen] = useState(false);

  const refresh = useCallback(async () => {
    const data = await loadItems();
    setItems(data);
    setLoading(false);
  }, [loadItems]);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = items.filter(item => {
    if (!query) return true;
    return searchKeys.some(key =>
      String(item[key] ?? "").toLowerCase().includes(query.toLowerCase())
    );
  });

  async function handleSave(data) {
    const updated = await onSave(data);
    setItems(updated);
    setEditing(null);
  }

  async function handleDelete(id) {
    const updated = await onDelete(id);
    setItems(updated);
    setConfirmDelete(null);
  }

  async function handleCsvImport(rows) {
    if (onBulkImport) {
      const updated = await onBulkImport(rows);
      setItems(updated);
    }
  }

  const ResultIcon = EmptyIcon ?? Inbox;

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#39FF88] border-t-transparent" />
          <p className="text-sm text-[#A9B7AF]">Loading {title.toLowerCase()}…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-screen flex-col overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_4%,rgba(57,255,136,0.12),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(0,200,83,0.06),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:42px_42px]" />

      {/* Header */}
      <header className="relative z-10 border-b border-[#102016] bg-black/95 px-8 py-6 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="case-kicker mb-2">Library</p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white">{title}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A9B7AF]">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {csvFields && (
              <button onClick={() => setCsvOpen(true)} className="btn gap-1.5">
                <Upload size={14} />
                Import CSV
              </button>
            )}
            <button onClick={() => setEditing({})} className="btn-primary">
              <Plus size={15} />
              Add new
            </button>
          </div>
        </div>
      </header>

      {/* Search / Stats */}
      <section className="relative z-10 border-b border-[#102016] bg-black/90 px-8 py-4 backdrop-blur-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F7D75]" />
            <input className="input pl-11" placeholder={`Search ${title.toLowerCase()}…`} value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <StatusPill tone="neutral">{filtered.length} shown</StatusPill>
            <StatusPill tone="success">{items.length} total</StatusPill>
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="relative z-10 flex-1 overflow-y-auto px-8 py-6">
        {filtered.length === 0 ? (
          <WidgetPanel className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] border border-[#39FF88]/25 bg-[#39FF88]/10 text-[#39FF88] shadow-[0_0_32px_rgba(57,255,136,0.12)]">
              <ResultIcon size={32} />
            </div>
            <h2 className="text-xl font-semibold tracking-[-0.04em] text-white">
              {query ? "No matching records" : `No ${title.toLowerCase()} yet`}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#A9B7AF]">
              {query ? `No results found for "${query}".` : `Add your first ${title.toLowerCase().slice(0, -1)} to start building reusable case data.`}
            </p>
            {!query && (
              <div className="mt-6 flex items-center gap-3">
                <button onClick={() => setEditing({})} className="btn-primary"><Plus size={15} />Add new</button>
                {csvFields && <button onClick={() => setCsvOpen(true)} className="btn gap-1.5"><Upload size={14} />Import CSV</button>}
              </div>
            )}
          </WidgetPanel>
        ) : (
          <motion.div variants={gridVariants} initial="initial" animate="animate" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filtered.map(item => (
                <motion.div key={item.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.96, y: 8 }} className="group relative">
                  <div className="widget-card min-h-[180px]">
                    <div className="absolute right-4 top-4 z-20 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button onClick={() => setEditing(item)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#102016] bg-black/70 text-[#A9B7AF] backdrop-blur transition hover:border-[#39FF88]/40 hover:bg-[#39FF88]/10 hover:text-[#39FF88]" title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setConfirmDelete(item)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#102016] bg-black/70 text-[#A9B7AF] backdrop-blur transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_80%_0%,rgba(57,255,136,0.12),transparent_36%)]" />
                    <div className="relative z-10 pr-14">{renderCard(item)}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Edit / Add modal */}
      {editing !== null && (
        <Modal
          open
          onClose={() => setEditing(null)}
          title={editing.id ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`}
          footer={
            <>
              <button className="btn" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-primary" form="lib-form" type="submit">Save</button>
            </>
          }
        >
          {renderForm({ item: editing, onSave: handleSave })}
        </Modal>
      )}

      {/* Confirm delete */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete record?"
        footer={
          <>
            <button className="btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="btn-danger" onClick={() => handleDelete(confirmDelete.id)}>Delete</button>
          </>
        }
      >
        <p className="text-sm leading-6 text-[#A9B7AF]">
          Are you sure you want to delete{" "}
          <strong className="font-semibold text-white">{confirmDelete?.name}</strong>? This cannot be undone.
        </p>
      </Modal>

      {/* CSV Import modal */}
      {csvFields && (
        <CsvImportModal
          open={csvOpen}
          onClose={() => setCsvOpen(false)}
          entityName={title}
          fields={csvFields}
          onImport={handleCsvImport}
        />
      )}
    </div>
  );
}
