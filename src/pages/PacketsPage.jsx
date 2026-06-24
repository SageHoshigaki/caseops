import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scale, FilePlus, Trash2, ArrowRight, Clock } from "lucide-react";
import { PageHeader, PageBody } from "../components/layout/Page.jsx";
import { getPackets, getClients, deletePacket } from "../lib/store.js";
import { format } from "date-fns";
import { clsx } from "clsx";

const STATUS = {
  draft:     { label: "Draft",     cls: "badge-ink" },
  ready:     { label: "Ready",     cls: "badge-amber" },
  generated: { label: "Generated", cls: "badge-green" },
};

export default function PacketsPage() {
  const navigate = useNavigate();
  const [packets, setPackets] = useState(getPackets);
  const clients = getClients();

  function remove(id) {
    if (!confirm("Delete this packet?")) return;
    setPackets(deletePacket(id));
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Packets"
        subtitle="All case packets — click to continue building or review"
        actions={
          <button onClick={() => navigate("/builder")} className="btn-primary">
            <FilePlus size={14} /> New Packet
          </button>
        }
      />
      <PageBody>
        {packets.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <Scale size={36} className="text-ink-200 mb-4" />
            <p className="text-sm text-ink-400">No packets yet.</p>
            <button onClick={() => navigate("/builder")} className="btn-primary mt-4">
              <FilePlus size={14} /> Build first packet
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {[...packets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(p => {
              const client = clients.find(c => c.id === p.clientId);
              const st     = STATUS[p.status] ?? STATUS.draft;
              return (
                <div
                  key={p.id}
                  className="card px-5 py-4 flex items-center gap-5 hover:border-ink-200 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/builder/${p.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-medium text-ink-800">{client?.name ?? "Unknown client"}</span>
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                    </div>
                    <div className="text-xs text-ink-400 flex items-center gap-3">
                      <span className="capitalize">{p.district || "No district"}</span>
                      {p.caseNumber && <><span>·</span><span className="font-mono">{p.caseNumber}</span></>}
                      {p.defendantIds.length > 0 && <><span>·</span><span>{p.defendantIds.length} defendant{p.defendantIds.length > 1 ? "s" : ""}</span></>}
                      {p.violationIds.length > 0 && <><span>·</span><span>{p.violationIds.length} violation{p.violationIds.length > 1 ? "s" : ""}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-ink-300 shrink-0">
                    <Clock size={11} />
                    {format(new Date(p.createdAt), "MMM d, yyyy")}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); remove(p.id); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:bg-rose-50 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                  <ArrowRight size={14} className="text-ink-300 group-hover:text-ink-500 transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </PageBody>
    </div>
  );
}
