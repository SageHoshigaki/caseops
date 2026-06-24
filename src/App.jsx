import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import {
  FolderOpen,
  Users,
  Briefcase,
  Building2,
  AlertTriangle,
  FilePlus,
  Scale,
  Layers3,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import Dashboard from "./pages/Dashboard.jsx";
import PacketBuilder from "./pages/PacketBuilder.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import AttorneysPage from "./pages/AttorneysPage.jsx";
import DefendantsPage from "./pages/DefendantsPage.jsx";
import ViolationsPage from "./pages/ViolationsPage.jsx";
import PacketsPage from "./pages/PacketsPage.jsx";

const NAV = [
  { to: "/", label: "Dashboard", icon: FolderOpen, end: true },
  { to: "/packets", label: "Packets", icon: Scale },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/attorneys", label: "Attorneys", icon: Briefcase },
  { to: "/defendants", label: "Defendants", icon: Building2 },
  { to: "/violations", label: "Violations", icon: AlertTriangle },
];

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <aside className="relative flex w-[260px] shrink-0 flex-col border-r border-[#102016] bg-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(57,255,136,0.10),transparent_34%)]" />

        {/* Brand */}
        <div className="relative border-b border-[#102016] px-5 py-5">
          <button
            onClick={() => navigate("/")}
            className="group flex w-full items-center gap-3 rounded-[22px] border border-[#102016] bg-[#050805] p-3 text-left transition hover:border-[#39FF88]/40 hover:bg-[#07100B]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#39FF88]/30 bg-[#39FF88]/10 text-[#39FF88] shadow-[0_0_28px_rgba(57,255,136,0.12)]">
              <Scale size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-black tracking-[-0.03em] text-white">
                CaseOps
              </div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#39FF88]">
                Packet Builder
              </div>
            </div>
          </button>
        </div>

        {/* Primary Action */}
        <div className="relative px-4 pb-3 pt-4">
          <button
            onClick={() => navigate("/builder")}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-[#39FF88] bg-[#39FF88] px-4 py-3 text-sm font-black text-black shadow-[0_0_32px_rgba(57,255,136,0.22)] transition hover:-translate-y-0.5 hover:bg-[#62FFA0] hover:shadow-[0_0_44px_rgba(57,255,136,0.32)]"
          >
            <FilePlus size={15} />
            New Packet
            <Sparkles size={13} className="opacity-70" />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 overflow-y-auto px-4 py-2">
          <p className="case-kicker px-2 py-3">Workspace</p>

          <div className="space-y-1.5">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    "group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-sm font-bold transition-all duration-300",
                    isActive
                      ? "border-[#39FF88]/45 bg-[#39FF88]/10 text-[#39FF88] shadow-[0_0_32px_rgba(57,255,136,0.10)]"
                      : "border-transparent text-[#6F7D75] hover:border-[#102016] hover:bg-[#07100B] hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#39FF88] shadow-[0_0_18px_rgba(57,255,136,0.65)]" />
                    )}

                    <span
                      className={clsx(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition",
                        isActive
                          ? "border-[#39FF88]/35 bg-[#39FF88]/10 text-[#39FF88]"
                          : "border-[#102016] bg-[#030603] text-[#6F7D75] group-hover:border-[#39FF88]/25 group-hover:text-[#39FF88]"
                      )}
                    >
                      <Icon size={16} />
                    </span>

                    <span className="min-w-0 flex-1 truncate">{label}</span>

                    <ChevronRight
                      size={14}
                      className={clsx(
                        "transition",
                        isActive
                          ? "translate-x-0 text-[#39FF88]"
                          : "text-[#395242] opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100"
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom status card */}
        <div className="relative border-t border-[#102016] p-4">
          <div className="rounded-[22px] border border-[#102016] bg-[#050805] p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#39FF88]/25 bg-[#39FF88]/10 text-[#39FF88]">
                <Layers3 size={16} />
              </div>

              <div>
                <div className="text-xs font-bold text-white">
                  Local Workspace
                </div>
                <div className="text-[11px] text-[#6F7D75]">
                  Desktop-ready data
                </div>
              </div>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[#07100B]">
              <div className="h-full w-[72%] rounded-full bg-[#39FF88] shadow-[0_0_20px_rgba(57,255,136,0.45)]" />
            </div>

            <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#39FF88]">
              System Active
            </div>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-black">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/packets" element={<PacketsPage />} />
          <Route path="/builder" element={<PacketBuilder />} />
          <Route path="/builder/:id" element={<PacketBuilder />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/attorneys" element={<AttorneysPage />} />
          <Route path="/defendants" element={<DefendantsPage />} />
          <Route path="/violations" element={<ViolationsPage />} />
        </Routes>
      </main>
    </div>
  );
}
