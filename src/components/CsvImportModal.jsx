import { useState, useRef, useCallback } from "react";
import { Upload, FileSpreadsheet, AlertTriangle, Check, Trash2, ArrowRight } from "lucide-react";
import { Modal, StatusPill } from "./ui/index.jsx";
import Papa from "papaparse";
import { clsx } from "clsx";

/**
 * CsvImportModal — drag-and-drop or browse for a CSV, preview rows, bulk import.
 *
 * Props:
 *   open       — boolean
 *   onClose    — () => void
 *   entityName — "Clients" | "Attorneys" | "Defendants" | "Violations"
 *   fields     — [{ key, label, required? }]  — column spec for this entity
 *   onImport   — async (rows: object[]) => void  — receives clean mapped objects
 */
export default function CsvImportModal({ open, onClose, entityName, fields, onImport }) {
  const [file, setFile]         = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvRows, setCsvRows]   = useState([]);
  const [mapping, setMapping]   = useState({});    // fieldKey → csvHeader
  const [importing, setImporting] = useState(false);
  const [done, setDone]         = useState(false);
  const [importCount, setImportCount] = useState(0);
  const [error, setError]       = useState(null);
  const inputRef = useRef(null);

  function reset() {
    setFile(null);
    setCsvHeaders([]);
    setCsvRows([]);
    setMapping({});
    setImporting(false);
    setDone(false);
    setImportCount(0);
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  // ── File handling ───────────────────────────────────────────────
  const handleFile = useCallback((f) => {
    if (!f || !f.name.endsWith(".csv")) {
      setError("Please upload a .csv file");
      return;
    }
    setError(null);
    setFile(f);

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (results.errors.length > 0) {
          setError(`CSV parse error: ${results.errors[0].message}`);
          return;
        }
        const headers = results.meta.fields || [];
        setCsvHeaders(headers);
        setCsvRows(results.data);

        // Auto-map columns by fuzzy matching
        const autoMap = {};
        for (const field of fields) {
          const match = headers.find(h => {
            const hLow = h.toLowerCase().replace(/[_\-\s]/g, "");
            const fLow = field.key.toLowerCase().replace(/[_\-\s]/g, "");
            const lLow = field.label.toLowerCase().replace(/[_\-\s]/g, "");
            return hLow === fLow || hLow === lLow || hLow.includes(fLow) || fLow.includes(hLow);
          });
          if (match) autoMap[field.key] = match;
        }
        setMapping(autoMap);
      },
      error(err) {
        setError(`Failed to read CSV: ${err.message}`);
      },
    });
  }, [fields]);

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  }

  function onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // ── Import ──────────────────────────────────────────────────────
  async function doImport() {
    setImporting(true);
    setError(null);

    try {
      const rows = csvRows.map(csvRow => {
        const obj = {};
        for (const field of fields) {
          const csvCol = mapping[field.key];
          obj[field.key] = csvCol ? (csvRow[csvCol] || "").trim() : "";
        }
        return obj;
      }).filter(row => {
        // Skip rows where all required fields are empty
        return fields.filter(f => f.required).every(f => row[f.key]);
      });

      await onImport(rows);
      setImportCount(rows.length);
      setDone(true);
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  }

  const mappedCount = Object.keys(mapping).length;
  const requiredFields = fields.filter(f => f.required);
  const requiredMapped = requiredFields.every(f => mapping[f.key]);

  return (
    <Modal open={open} onClose={handleClose} title={`Import ${entityName} from CSV`} wide>
      {done ? (
        // ── Success state ──────────────────────────────────────
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[24px] border border-[#39FF88]/25 bg-[#39FF88]/10 text-[#39FF88] shadow-[0_0_32px_rgba(57,255,136,0.12)]">
            <Check size={32} />
          </div>
          <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">
            {importCount} {entityName.toLowerCase()} imported
          </h3>
          <p className="mt-2 text-sm text-[#A9B7AF]">
            All records have been added to your database.
          </p>
          <button className="btn-primary mt-6" onClick={handleClose}>Done</button>
        </div>
      ) : !file ? (
        // ── Drop zone ──────────────────────────────────────────
        <div>
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={() => inputRef.current?.click()}
            className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[22px] border-2 border-dashed border-[#1B2E24] bg-[#050805] transition hover:border-[#39FF88]/40 hover:bg-[#07100B]"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#39FF88]/25 bg-[#39FF88]/10 text-[#39FF88] transition group-hover:shadow-[0_0_32px_rgba(57,255,136,0.12)]">
              <Upload size={24} />
            </div>
            <p className="text-sm font-medium text-white">
              Drop a CSV file here or click to browse
            </p>
            <p className="mt-1.5 text-xs text-[#6F7D75]">
              Supports .csv files with headers
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* Expected columns hint */}
          <div className="mt-4 rounded-2xl border border-[#1B2E24] bg-[#050805] px-4 py-3">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#39FF88]">
              Expected columns
            </p>
            <div className="flex flex-wrap gap-1.5">
              {fields.map(f => (
                <span
                  key={f.key}
                  className={clsx(
                    "inline-flex items-center rounded-lg border px-2 py-1 text-[11px]",
                    f.required
                      ? "border-[#39FF88]/25 bg-[#39FF88]/10 text-[#39FF88]"
                      : "border-[#1B2E24] text-[#6F7D75]"
                  )}
                >
                  {f.label}{f.required ? " *" : ""}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}
        </div>
      ) : (
        // ── Preview + mapping ──────────────────────────────────
        <div>
          {/* File info bar */}
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#1B2E24] bg-[#050805] px-4 py-3">
            <FileSpreadsheet size={18} className="shrink-0 text-[#39FF88]" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">{file.name}</div>
              <div className="text-xs text-[#6F7D75]">{csvRows.length} rows · {csvHeaders.length} columns</div>
            </div>
            <button onClick={reset} className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#1B2E24] text-[#6F7D75] transition hover:border-red-400/40 hover:text-red-300">
              <Trash2 size={13} />
            </button>
          </div>

          {/* Column mapping */}
          <div className="mb-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#39FF88]">
              Column mapping
            </p>
            <div className="space-y-2">
              {fields.map(f => (
                <div key={f.key} className="flex items-center gap-3">
                  <span className={clsx(
                    "w-36 shrink-0 truncate text-xs font-medium",
                    f.required ? "text-white" : "text-[#A9B7AF]"
                  )}>
                    {f.label}{f.required ? " *" : ""}
                  </span>
                  <ArrowRight size={12} className="shrink-0 text-[#6F7D75]" />
                  <select
                    className="input flex-1 text-xs"
                    value={mapping[f.key] || ""}
                    onChange={e => setMapping(m => ({ ...m, [f.key]: e.target.value }))}
                  >
                    <option value="">— skip —</option>
                    {csvHeaders.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  {mapping[f.key] && (
                    <Check size={14} className="shrink-0 text-[#39FF88]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview table */}
          <div className="mb-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6F7D75]">
              Preview ({Math.min(5, csvRows.length)} of {csvRows.length} rows)
            </p>
            <div className="overflow-x-auto rounded-2xl border border-[#1B2E24]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1B2E24] bg-[#050805]">
                    {fields.filter(f => mapping[f.key]).map(f => (
                      <th key={f.key} className="px-3 py-2 text-left font-medium text-[#39FF88]">
                        {f.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvRows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-[#1B2E24]/50 last:border-0">
                      {fields.filter(f => mapping[f.key]).map(f => (
                        <td key={f.key} className="px-3 py-2 text-[#A9B7AF]">
                          {row[mapping[f.key]] || <span className="text-[#6F7D75] italic">empty</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <StatusPill tone={requiredMapped ? "success" : "warning"}>
              {mappedCount}/{fields.length} mapped
            </StatusPill>
            {!requiredMapped && (
              <span className="text-xs text-yellow-300">
                Required fields need mapping
              </span>
            )}
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              <AlertTriangle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex items-center justify-end gap-3">
            <button className="btn" onClick={handleClose}>Cancel</button>
            <button
              className="btn-primary"
              disabled={!requiredMapped || importing}
              onClick={doImport}
            >
              {importing ? "Importing…" : `Import ${csvRows.length} ${entityName.toLowerCase()}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
