import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clsx } from "clsx";
import { Check, ArrowLeft, ArrowRight, User, MapPin, Briefcase, Building2,
         AlertTriangle, ClipboardList, FileDown, CheckCircle2, Users,
         ChevronRight, Download } from "lucide-react";
import { getClients, getAttorneysByDistrict, getDefendants, getViolations,
         blankPacket, savePacket, getPackets } from "../lib/store.js";
import { generatePacketFiles, downloadAllAsZip } from "../lib/fillPdf.js";
import { SelCard, MultiCard, Input, Toggle, Alert, ProgressBar } from "../components/ui/index.jsx";

const INNER_STEPS = ["district","attorney","defendant","violation","details"];
const INNER_LABELS = { district:"District", attorney:"Attorney", defendant:"Defendant", violation:"Violation", details:"Details" };
const INNER_ICONS  = { district:MapPin, attorney:Briefcase, defendant:Building2, violation:AlertTriangle, details:ClipboardList };

const DISTRICTS = [
  { id:"california", label:"Central District of California", short:"CACD", forms:["AO 440","CV-030","CV-071"] },
  { id:"georgia",    label:"Northern District of Georgia",   short:"NDGA", forms:["AO 440","JS44"] },
];

export default function PacketBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState("select");
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [packets, setPackets] = useState({});
  const [clientIndex, setClientIndex] = useState(0);
  const [innerStep, setInnerStep] = useState(0);
  const [gen, setGen] = useState({ running:false, done:false, progress:0, currentClient:0, results:[], allFiles:[] });

  const clients    = getClients();
  const defendants = getDefendants();
  const violations = getViolations();
  const allAttys   = [...getAttorneysByDistrict("california"), ...getAttorneysByDistrict("georgia")];

  const selectedClients = selectedClientIds.map(cid => clients.find(c => c.id === cid)).filter(Boolean);
  const currentClient   = selectedClients[clientIndex];
  const currentPacket   = currentClient ? (packets[currentClient.id] || {}) : {};
  const currentDistrict = DISTRICTS.find(d => d.id === currentPacket.district);
  const currentAttorneys = currentPacket.district ? getAttorneysByDistrict(currentPacket.district) : [];

  useEffect(() => {
    if (id) {
      const p = getPackets().find(x => x.id === id);
      if (p) {
        setSelectedClientIds([p.clientId]);
        setPackets({ [p.clientId]: { district:p.district, attorneyId:p.attorneyId, defendantIds:p.defendantIds, violationIds:p.violationIds, caseNumber:p.caseNumber, amountDemanded:p.amountDemanded, juryDemand:p.juryDemand, cacdDivision:p.cacdDivision }});
        setPhase("build");
      }
    }
  }, [id]);

  useEffect(() => {
    setPackets(prev => {
      const next = { ...prev };
      selectedClientIds.forEach(cid => {
        if (!next[cid]) next[cid] = { district:"", attorneyId:"", defendantIds:[], violationIds:[], caseNumber:"", amountDemanded:"", juryDemand:false, cacdDivision:"" };
      });
      return next;
    });
  }, [selectedClientIds]);

  function toggleClient(cid) { setSelectedClientIds(prev => prev.includes(cid) ? prev.filter(x=>x!==cid) : [...prev, cid]); }
  function updatePacket(clientId, patch) { setPackets(prev => ({ ...prev, [clientId]: { ...prev[clientId], ...patch } })); }

  function innerStepDone(pkt, step) {
    if (step===0) return !!pkt.district;
    if (step===1) return !!pkt.attorneyId;
    if (step===2) return (pkt.defendantIds||[]).length > 0;
    if (step===3) return (pkt.violationIds||[]).length > 0;
    if (step===4) return !!pkt.caseNumber;
    return false;
  }
  function allInnerDone(pkt) { return INNER_STEPS.every((_,i) => innerStepDone(pkt, i)); }

  function startBuild() { setClientIndex(0); setInnerStep(0); setPhase("build"); }

  function nextInner() {
    if (innerStep < INNER_STEPS.length - 1) { setInnerStep(i => i+1); }
    else if (clientIndex < selectedClients.length - 1) { setClientIndex(i => i+1); setInnerStep(0); }
    else { setPhase("review"); }
  }
  function prevInner() {
    if (innerStep > 0) { setInnerStep(i => i-1); }
    else if (clientIndex > 0) { setClientIndex(i => i-1); setInnerStep(INNER_STEPS.length - 1); }
    else { setPhase("select"); }
  }
  function jumpToClient(ci) { setClientIndex(ci); setInnerStep(0); setPhase("build"); }

  // ── REAL PDF GENERATION ─────────────────────────────────────────────────
  async function generate() {
    setGen({ running:true, done:false, progress:0, currentClient:0, results:[], allFiles:[] });

    const results = [];
    const allFiles = [];

    for (let ci = 0; ci < selectedClients.length; ci++) {
      const client = selectedClients[ci];
      const pkt = packets[client.id] || {};
      const attorney = allAttys.find(a => a.id === pkt.attorneyId);
      const defs = defendants.filter(d => (pkt.defendantIds||[]).includes(d.id));
      const viols = violations.filter(v => (pkt.violationIds||[]).includes(v.id));
      const dist = DISTRICTS.find(d => d.id === pkt.district);

      setGen(g => ({ ...g, currentClient: ci, progress: Math.round((ci / selectedClients.length) * 100) }));

      try {
        const files = await generatePacketFiles(client, attorney, defs, viols, pkt);
        allFiles.push(...files);
        results.push({ client, files, district: dist, error: null });
      } catch (err) {
        console.error(`Error generating for ${client.name}:`, err);
        results.push({ client, files: [], district: dist, error: err.message });
      }

      // Save packet record
      const record = {
        ...blankPacket(),
        clientId: client.id, district: pkt.district, attorneyId: pkt.attorneyId,
        defendantIds: pkt.defendantIds, violationIds: pkt.violationIds,
        caseNumber: pkt.caseNumber, amountDemanded: pkt.amountDemanded,
        juryDemand: pkt.juryDemand, cacdDivision: pkt.cacdDivision,
        status: "generated", generatedAt: new Date().toISOString(),
      };
      savePacket(record);
    }

    setGen({ running:false, done:true, progress:100, currentClient: selectedClients.length-1, results, allFiles });
  }

  const s = INNER_STEPS[innerStep];
  const attorney = allAttys.find(a => a.id === currentPacket.attorneyId);

  return (
    <div className="flex flex-col h-full bg-ink-50">
      {/* Top bar */}
      <div className="bg-white border-b border-ink-100 px-6 py-3 flex items-center gap-4 shrink-0">
        <button onClick={() => phase === "select" ? navigate(-1) : phase === "build" ? prevInner() : setPhase("build")} className="btn-ghost gap-1.5 text-xs">
          <ArrowLeft size={13}/>Back
        </button>
        <div className="h-4 w-px bg-ink-100" />
        <span className="text-sm font-medium text-ink-700">Packet Builder</span>
        {selectedClientIds.length > 1 && phase !== "select" && <span className="badge-blue">{selectedClientIds.length} clients</span>}

        {phase === "build" && selectedClients.length > 1 && (
          <>
            <div className="h-4 w-px bg-ink-100" />
            <div className="flex items-center gap-1">
              {selectedClients.map((c, i) => {
                const pkt = packets[c.id] || {};
                const done = allInnerDone(pkt);
                const active = i === clientIndex;
                return (
                  <button key={c.id} onClick={() => { setClientIndex(i); setInnerStep(0); }}
                    className={clsx("px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                      active ? "bg-blue-500 text-white" : done ? "bg-blue-50 text-blue-500" : "bg-ink-100 text-ink-400 hover:text-ink-600")}>
                    {c.name.split(" ")[0]}
                    {done && !active && <Check size={10} className="inline ml-1" strokeWidth={3}/>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {phase === "build" && (
          <div className="flex items-center gap-1.5 ml-auto">
            {INNER_STEPS.map((sid, i) => {
              const done = innerStepDone(currentPacket, i); const active = i === innerStep; const Icon = INNER_ICONS[sid];
              return (
                <div key={sid} className="flex items-center gap-1.5">
                  {i > 0 && <div className="w-3 h-px bg-ink-200"/>}
                  <button onClick={() => (i <= innerStep || done) && setInnerStep(i)} title={INNER_LABELS[sid]}
                    className={clsx("step-dot", active && "active", !active && done && "done", i > innerStep && !done && "locked")}>
                    {done && !active ? <Check size={10} strokeWidth={3}/> : <Icon size={11}/>}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stage */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 anim-in" key={phase === "build" ? `${clientIndex}-${innerStep}` : phase}>
          {phase === "select" && <PhaseSelect clients={clients} selectedIds={selectedClientIds} onToggle={toggleClient}/>}
          {phase === "build" && currentClient && (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-semibold text-blue-600">{currentClient.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink-800">{currentClient.name}</p>
                    <p className="text-[11px] text-ink-400">Client {clientIndex+1} of {selectedClients.length}</p>
                  </div>
                </div>
                <h1 className="text-2xl font-semibold text-ink-900 capitalize">{INNER_LABELS[INNER_STEPS[innerStep]]}</h1>
              </div>
              {innerStep===0 && <BuildDistrict pkt={currentPacket} update={p => updatePacket(currentClient.id, { ...p, attorneyId:"" })}/>}
              {innerStep===1 && <BuildAttorney attorneys={currentAttorneys} pkt={currentPacket} update={p => updatePacket(currentClient.id, p)} district={currentDistrict}/>}
              {innerStep===2 && <BuildDefendant defendants={defendants} pkt={currentPacket} update={p => updatePacket(currentClient.id, p)}/>}
              {innerStep===3 && <BuildViolation violations={violations} pkt={currentPacket} update={p => updatePacket(currentClient.id, p)}/>}
              {innerStep===4 && <BuildDetails client={currentClient} pkt={currentPacket} update={p => updatePacket(currentClient.id, p)}/>}
            </>
          )}
          {phase === "review" && <ReviewAll selectedClients={selectedClients} packets={packets} defendants={defendants} violations={violations} allAttys={allAttys} onEdit={jumpToClient}/>}
          {phase === "generate" && <GenerateAll selectedClients={selectedClients} packets={packets} gen={gen} onGenerate={generate} onDone={() => navigate("/packets")}/>}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-ink-100 px-6 py-3 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {phase === "select" && selectedClientIds.length > 0 && <span className="chip filled">{selectedClientIds.length} client{selectedClientIds.length>1?"s":""} selected</span>}
          {phase === "build" && currentClient && (
            <>
              <span className="chip filled">{currentClient.name.split(" ")[0]}</span>
              {currentPacket.district && <span className="chip filled">{DISTRICTS.find(d=>d.id===currentPacket.district)?.short}</span>}
              {currentPacket.attorneyId && <span className="chip filled">Attorney</span>}
              {(currentPacket.defendantIds||[]).length > 0 && <span className="chip filled">{currentPacket.defendantIds.length} Def</span>}
              {(currentPacket.violationIds||[]).length > 0 && <span className="chip filled">{currentPacket.violationIds.length} Viol</span>}
            </>
          )}
          {phase === "review" && <span className="chip filled">{selectedClients.length} packet{selectedClients.length>1?"s":""} ready</span>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {phase === "select" && <button className="btn-primary gap-1.5" disabled={selectedClientIds.length===0} onClick={startBuild}>Start building <ArrowRight size={13}/></button>}
          {phase === "build" && (
            <>
              <button className="btn gap-1.5" onClick={prevInner}><ArrowLeft size={13}/>Back</button>
              <button className="btn-primary gap-1.5" disabled={!innerStepDone(currentPacket, innerStep)} onClick={nextInner}>
                {innerStep < INNER_STEPS.length-1 ? <>Next <ArrowRight size={13}/></> : clientIndex < selectedClients.length-1 ? <>Next client <ChevronRight size={13}/></> : <>Review all <CheckCircle2 size={13}/></>}
              </button>
            </>
          )}
          {phase === "review" && (
            <>
              <button className="btn gap-1.5" onClick={() => { setPhase("build"); setClientIndex(selectedClients.length-1); setInnerStep(INNER_STEPS.length-1); }}><ArrowLeft size={13}/>Back</button>
              <button className="btn-primary gap-1.5" onClick={() => setPhase("generate")}>Generate {selectedClients.length > 1 ? `${selectedClients.length} packets` : "packet"} <FileDown size={13}/></button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Phase: Select ────────────────────────────────────────────────────────────
function PhaseSelect({ clients, selectedIds, onToggle }) {
  return (
    <>
      <div className="mb-8">
        <p className="section-label mb-1">Step 1</p>
        <h1 className="text-2xl font-semibold text-ink-900">Select clients</h1>
        <p className="text-sm text-ink-400 mt-1">Pick one or more — each gets their own full packet.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {clients.map(c => (
          <MultiCard key={c.id} selected={selectedIds.includes(c.id)} onClick={() => onToggle(c.id)}>
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              <span className="text-xs font-semibold text-blue-600">{c.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
            </div>
            <div className="text-sm font-medium text-ink-800 pr-6">{c.name}</div>
            <div className="text-xs text-ink-400 mt-1">{c.phone}</div>
            <div className="text-xs text-ink-400">{c.county} County</div>
            {c.notes && <div className="text-[11px] text-ink-300 mt-2 line-clamp-2">{c.notes}</div>}
          </MultiCard>
        ))}
      </div>
    </>
  );
}

// ── Build substeps ───────────────────────────────────────────────────────────
function BuildDistrict({ pkt, update }) {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      {DISTRICTS.map(d => (
        <SelCard key={d.id} selected={pkt.district===d.id} onClick={() => update({ district:d.id })}>
          <div className="flex items-start gap-3 pr-6">
            <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center shrink-0"><MapPin size={16} className="text-ink-400"/></div>
            <div>
              <div className="font-semibold text-ink-800">{d.short}</div>
              <div className="text-xs text-ink-500 mt-0.5">{d.label}</div>
              <div className="flex flex-wrap gap-1 mt-2">{d.forms.map(f => <span key={f} className="badge-ink text-[10px] px-1.5 py-0.5 rounded">{f}</span>)}</div>
            </div>
          </div>
        </SelCard>
      ))}
    </div>
  );
}

function BuildAttorney({ attorneys, pkt, update, district }) {
  if (!district) return <Alert type="warning">Select a district first.</Alert>;
  if (!attorneys.length) return <Alert type="info">No attorneys for this district. Add one in the Attorneys library.</Alert>;
  return (
    <div className="grid grid-cols-2 gap-3 max-w-3xl">
      {attorneys.map(a => (
        <SelCard key={a.id} selected={pkt.attorneyId===a.id} onClick={() => update({ attorneyId:a.id })}>
          <div className="flex items-start gap-3 pr-6">
            <div className="w-9 h-9 rounded-full bg-sage-100 flex items-center justify-center shrink-0"><Briefcase size={14} className="text-sage-500"/></div>
            <div>
              <div className="text-sm font-medium text-ink-800">{a.name}</div>
              <div className="text-xs text-ink-500">{a.firm}</div>
              <div className="text-xs text-ink-400 mt-1">{a.phone}</div>
              <div className="text-[11px] text-ink-300 mt-0.5 font-mono">Bar #{a.barNumber}</div>
            </div>
          </div>
        </SelCard>
      ))}
    </div>
  );
}

function BuildDefendant({ defendants, pkt, update }) {
  const ids = pkt.defendantIds || [];
  const toggle = id => update({ defendantIds: ids.includes(id) ? ids.filter(x=>x!==id) : [...ids, id] });
  return (
    <div>
      <p className="text-xs text-ink-400 mb-4">Click to toggle — select all that apply</p>
      <div className="grid grid-cols-2 gap-3">
        {defendants.map(d => (
          <MultiCard key={d.id} selected={ids.includes(d.id)} onClick={() => toggle(d.id)}>
            <div className="pr-6">
              <span className="badge-ink mb-2 inline-block">{d.type}</span>
              <div className="text-sm font-medium text-ink-800">{d.name}</div>
              <div className="text-xs text-ink-400 mt-1.5 space-y-0.5">
                <div>📍 {d.serviceAddress}</div>
                {d.registeredAgent && <div>🤝 {d.registeredAgent}</div>}
                {d.county && <div>🗺 {d.county} County</div>}
              </div>
            </div>
          </MultiCard>
        ))}
      </div>
    </div>
  );
}

function BuildViolation({ violations, pkt, update }) {
  const ids = pkt.violationIds || [];
  const toggle = id => update({ violationIds: ids.includes(id) ? ids.filter(x=>x!==id) : [...ids, id] });
  const cats = [...new Set(violations.map(v => v.category))];
  return (
    <div className="space-y-6">
      {cats.map(cat => (
        <div key={cat}>
          <p className="section-label mb-3">{cat}</p>
          <div className="grid grid-cols-2 gap-3">
            {violations.filter(v => v.category===cat).map(v => (
              <MultiCard key={v.id} selected={ids.includes(v.id)} onClick={() => toggle(v.id)}>
                <div className="pr-6">
                  <div className="font-mono text-[11px] text-ink-400 mb-1">{v.code}</div>
                  <div className="text-sm font-medium text-ink-800">{v.name}</div>
                  <div className="text-xs text-ink-400 mt-1">{v.statute}</div>
                  <div className="text-[11px] text-ink-300 mt-1 line-clamp-2">{v.description}</div>
                </div>
              </MultiCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BuildDetails({ client, pkt, update }) {
  return (
    <div className="max-w-md space-y-5">
      <div className="card px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-semibold text-blue-600">{client.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
        </div>
        <div>
          <div className="text-sm font-medium text-ink-800">{client.name}</div>
          <div className="text-xs text-ink-400">{client.phone} · {client.county} County</div>
        </div>
      </div>
      <Input label="Case number *" placeholder="e.g. 2:24-cv-04821" value={pkt.caseNumber||""} onChange={e => update({ caseNumber:e.target.value })} hint="Assigned by the court. Appears on all forms." />
      <Input label="Amount demanded ($)" placeholder="e.g. 75000" value={pkt.amountDemanded||""} onChange={e => update({ amountDemanded:e.target.value })} />
      <div>
        <label className="label">Jury demand</label>
        <Toggle checked={pkt.juryDemand||false} onChange={v => update({ juryDemand:v })} label={pkt.juryDemand ? "Yes — jury trial demanded" : "No jury demand"} />
      </div>
      {pkt.district==="california" && (
        <div>
          <label className="label">CACD Division</label>
          <select className="input" value={pkt.cacdDivision||""} onChange={e => update({ cacdDivision:e.target.value })}>
            <option value="">Select division…</option>
            <option value="Western">Western</option>
            <option value="Southern">Southern</option>
            <option value="Eastern">Eastern</option>
          </select>
          <p className="text-[11px] text-ink-400 mt-1">Required for CV-071 Section VIII.</p>
        </div>
      )}
    </div>
  );
}

// ── Review ───────────────────────────────────────────────────────────────────
function ReviewAll({ selectedClients, packets, defendants, violations, allAttys, onEdit }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <p className="section-label mb-1">Review</p>
        <h1 className="text-2xl font-semibold text-ink-900">{selectedClients.length} packet{selectedClients.length>1?"s":""} ready</h1>
        <p className="text-sm text-ink-400 mt-1">Click any card to edit.</p>
      </div>
      <div className="space-y-4">
        {selectedClients.map((c, ci) => {
          const pkt = packets[c.id] || {};
          const dist = DISTRICTS.find(d => d.id === pkt.district);
          const atty = allAttys.find(a => a.id === pkt.attorneyId);
          const defs = defendants.filter(d => (pkt.defendantIds||[]).includes(d.id));
          const viols = violations.filter(v => (pkt.violationIds||[]).includes(v.id));
          return (
            <div key={c.id} className="card overflow-hidden hover:border-ink-200 transition-colors cursor-pointer" onClick={() => onEdit(ci)}>
              <div className="flex items-center gap-3 px-5 py-3 bg-ink-50 border-b border-ink-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-blue-600">{c.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
                </div>
                <div className="flex-1"><div className="text-sm font-medium text-ink-800">{c.name}</div><div className="text-xs text-ink-400">{c.county} County</div></div>
                <span className="badge-blue">{dist?.short || "?"}</span>
              </div>
              <div className="px-5 py-3 text-xs space-y-1.5">
                <Row label="Attorney"     value={atty ? `${atty.name} · ${atty.firm}` : null}/>
                <Row label="Defendant(s)" value={defs.length ? defs.map(d=>d.name).join(", ") : null}/>
                <Row label="Violation(s)" value={viols.length ? viols.map(v=>v.code).join(", ") : null}/>
                <Row label="Case #"       value={pkt.caseNumber || null}/>
                <Row label="Amount"       value={pkt.amountDemanded ? `$${pkt.amountDemanded}` : "—"}/>
                <Row label="Jury"         value={pkt.juryDemand ? "Yes" : "No"}/>
              </div>
              <div className="px-5 py-2 border-t border-ink-50 flex items-center gap-2">
                {(dist?.forms||[]).map(f => <span key={f} className="flex items-center gap-1 text-[11px] text-ink-400"><CheckCircle2 size={11} className="text-sage-400"/>{f}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-24 shrink-0 text-ink-400">{label}</div>
      <div className={clsx("text-sm", value && value !== "—" ? "text-ink-700 font-medium" : "text-rose-400 italic")}>{value ?? "— missing"}</div>
    </div>
  );
}

// ── Generate + Download ─────────────────────────────────────────────────────
function GenerateAll({ selectedClients, packets, gen, onGenerate, onDone }) {
  if (gen.done) {
    const totalFiles = gen.results.reduce((sum, r) => sum + r.files.length, 0);
    return (
      <div className="max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-sage-100 flex items-center justify-center mx-auto mb-5"><CheckCircle2 size={32} className="text-sage-500"/></div>
          <h2 className="text-xl font-semibold text-ink-800 mb-2">{selectedClients.length} packet{selectedClients.length>1?"s":""} complete</h2>
          <p className="text-sm text-ink-400">{totalFiles} documents generated</p>
        </div>
        <div className="space-y-3 mb-6">
          {gen.results.map(({ client, files, district, error }) => (
            <div key={client.id} className="card overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-ink-50">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-semibold text-blue-600">{client.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
                </div>
                <div className="text-sm font-medium text-ink-800 flex-1">{client.name}</div>
                <span className="badge-blue text-[10px]">{district?.short}</span>
                {error ? <AlertTriangle size={14} className="text-rose-400"/> : <CheckCircle2 size={14} className="text-sage-400"/>}
              </div>
              {error ? (
                <div className="px-5 py-3 text-xs text-rose-500">{error}</div>
              ) : (
                <div className="px-5 py-2">
                  {files.map(f => (
                    <div key={f.name} className="flex items-center gap-2 py-1.5 text-xs text-ink-500">
                      <FileDown size={12} className="text-ink-300 shrink-0"/>
                      <span className="font-mono truncate">{f.name}</span>
                      <Check size={12} className="text-sage-400 ml-auto shrink-0"/>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button className="btn gap-2" onClick={onDone}>View all packets</button>
          <button className="btn-primary gap-2" onClick={() => downloadAllAsZip(gen.allFiles)}>
            <Download size={14}/>Download all ({totalFiles} files)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="section-label mb-1">Generate</p>
        <h1 className="text-2xl font-semibold text-ink-900">Generate {selectedClients.length} packet{selectedClients.length>1?"s":""}</h1>
        <p className="text-sm text-ink-400 mt-1">Fills your PDF templates with selected data and bundles them for download.</p>
      </div>
      {gen.running && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-ink-600">Processing packet {gen.currentClient+1} of {selectedClients.length}</span>
            <span className="badge-amber animate-pulse">Filling PDFs…</span>
          </div>
          <ProgressBar value={gen.progress}/>
        </div>
      )}
      <div className="space-y-2 mb-6">
        {selectedClients.map((c, ci) => {
          const pkt = packets[c.id] || {};
          const dist = DISTRICTS.find(d => d.id === pkt.district);
          const isDone = gen.running ? ci < gen.currentClient : false;
          const isCurrent = gen.running && ci === gen.currentClient;
          return (
            <div key={c.id} className={clsx("card px-5 py-4 flex items-center gap-4 transition-all", isCurrent && "border-blue-400")}>
              <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                isDone ? "bg-sage-100" : isCurrent ? "bg-blue-100" : "bg-ink-100")}>
                {isDone ? <Check size={12} className="text-sage-600" strokeWidth={3}/> :
                  <span className="text-[10px] font-semibold text-ink-500">{c.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className={clsx("text-sm font-medium", isDone ? "text-ink-500" : "text-ink-800")}>{c.name}</div>
                <div className="text-xs text-ink-400">{dist?.short} · {dist?.forms.length} forms · {pkt.caseNumber||"no case #"}</div>
              </div>
              {isDone && <span className="text-[11px] text-sage-500">Done</span>}
              {isCurrent && <span className="text-[11px] text-blue-500 animate-pulse">Filling…</span>}
            </div>
          );
        })}
      </div>
      {!gen.running && <button className="btn-primary" onClick={onGenerate}><FileDown size={15}/>Generate {selectedClients.length > 1 ? `all ${selectedClients.length} packets` : "packet"}</button>}
    </div>
  );
}
