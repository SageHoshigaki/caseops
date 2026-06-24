import { useNavigate } from "react-router-dom";
import {
  FilePlus,
  Users,
  Briefcase,
  Building2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Activity,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader, PageBody } from "../components/layout/Page.jsx";
import {
  getClients,
  getPackets,
  getDefendants,
  getViolations,
} from "../lib/store.js";
import { format } from "date-fns";

const gridVariants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.985,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const clients = getClients();
  const packets = getPackets();
  const defendants = getDefendants();
  const violations = getViolations();

  const recent = [...packets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      label: "Clients",
      value: clients.length,
      icon: Users,
      tone: "green",
      description: "Imported or created records",
    },
    {
      label: "Packets",
      value: packets.length,
      icon: FilePlus,
      tone: "green",
      description: "Legal packet drafts",
    },
    {
      label: "Defendants",
      value: defendants.length,
      icon: Building2,
      tone: "amber",
      description: "Companies being sued",
    },
    {
      label: "Violations",
      value: violations.length,
      icon: AlertTriangle,
      tone: "rose",
      description: "Reusable legal issues",
    },
  ];

  return (
    <div className="flex h-full min-h-screen flex-col overflow-hidden bg-black text-white">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your CaseOps workspace and packet production flow."
        actions={
          <button onClick={() => navigate("/builder")} className="btn-primary">
            <FilePlus size={15} />
            New Packet
          </button>
        }
      />

      <PageBody>
        {/* Hero / command card */}
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 overflow-hidden rounded-[32px] border border-[#102016] bg-[#050805] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.75)]"
        >
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 -m-6 bg-[radial-gradient(circle_at_90%_0%,rgba(57,255,136,0.14),transparent_34%)]" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="case-kicker mb-3">Legal Ops Command Center</p>

                <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-white">
                  Build packets faster with saved clients, attorneys,
                  defendants, violations, and district logic.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A9B7AF]">
                  Start from a client, click the connected legal data, review the
                  packet, and generate clean paperwork with fewer repeated
                  manual entries.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  onClick={() => navigate("/builder")}
                  className="btn-primary"
                >
                  <Sparkles size={15} />
                  Build Packet
                </button>

                <button onClick={() => navigate("/packets")} className="btn">
                  View Packets
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={gridVariants}
          initial="initial"
          animate="animate"
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map(({ label, value, icon: Icon, tone, description }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="widget-card min-h-[150px]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className={iconClass(tone)}>
                  <Icon size={18} />
                </div>

                <span className={pillClass(tone)}>{label}</span>
              </div>

              <div className="text-4xl font-semibold tracking-[-0.06em] text-white">
                {value}
              </div>

              <div className="mt-2 text-xs leading-5 text-[#A9B7AF]">
                {description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          {/* Recent packets */}
          <section className="overflow-hidden rounded-[28px] border border-[#102016] bg-[#050805] shadow-[0_24px_90px_rgba(0,0,0,0.75)]">
            <div className="flex items-center justify-between border-b border-[#102016] px-5 py-4">
              <div>
                <p className="case-kicker mb-1">Recent Work</p>
                <h2 className="text-sm font-semibold text-white">
                  Recent packets
                </h2>
              </div>

              <button
                onClick={() => navigate("/packets")}
                className="btn-ghost text-xs"
              >
                View all
                <ArrowRight size={12} />
              </button>
            </div>

            {recent.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[22px] border border-[#39FF88]/25 bg-[#39FF88]/10 text-[#39FF88]">
                  <FilePlus size={25} />
                </div>

                <h3 className="text-lg font-semibold tracking-[-0.04em] text-white">
                  No packets yet
                </h3>

                <p className="mt-2 text-sm text-[#A9B7AF]">
                  Start your first client packet from the builder.
                </p>

                <button
                  onClick={() => navigate("/builder")}
                  className="btn-primary mt-5"
                >
                  <FilePlus size={15} />
                  New Packet
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#102016]">
                {recent.map((packet) => {
                  const client = clients.find((c) => c.id === packet.clientId);

                  return (
                    <button
                      key={packet.id}
                      onClick={() => navigate(`/builder/${packet.id}`)}
                      className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-[#07100B]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#39FF88]/25 bg-[#39FF88]/10 text-[#39FF88]">
                        <Activity size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-white">
                          {client?.name ?? "Unknown client"}
                        </div>

                        <div className="mt-1 truncate text-xs capitalize text-[#A9B7AF]">
                          {packet.district || "No district"} ·{" "}
                          {packet.caseNumber || "No case #"}
                        </div>
                      </div>

                      <StatusBadge status={packet.status} />

                      <div className="hidden items-center gap-1 text-xs text-[#6F7D75] md:flex">
                        <Clock size={12} />
                        {format(new Date(packet.createdAt), "MMM d")}
                      </div>

                      <ArrowRight
                        size={14}
                        className="text-[#6F7D75] transition group-hover:translate-x-0.5 group-hover:text-[#39FF88]"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Quick actions */}
          <aside className="rounded-[28px] border border-[#102016] bg-[#050805] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.75)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="case-kicker mb-1">Shortcuts</p>
                <h2 className="text-sm font-semibold text-white">Quick add</h2>
              </div>

              <div className="widget-icon">
                <PlusIcon />
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: "New client", icon: Users, to: "/clients" },
                { label: "New attorney", icon: Briefcase, to: "/attorneys" },
                { label: "New defendant", icon: Building2, to: "/defendants" },
                {
                  label: "New violation",
                  icon: AlertTriangle,
                  to: "/violations",
                },
              ].map(({ label, icon: Icon, to }) => (
                <button
                  key={to}
                  onClick={() => navigate(to)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-[#102016] bg-black/35 px-4 py-3 text-left text-sm font-medium text-[#A9B7AF] transition hover:border-[#39FF88]/40 hover:bg-[#39FF88]/5 hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#102016] bg-[#030603] text-[#39FF88] transition group-hover:border-[#39FF88]/30 group-hover:bg-[#39FF88]/10">
                    <Icon size={15} />
                  </span>

                  <span className="flex-1">{label}</span>

                  <ArrowRight
                    size={13}
                    className="text-[#6F7D75] transition group-hover:translate-x-0.5 group-hover:text-[#39FF88]"
                  />
                </button>
              ))}
            </div>
          </aside>
        </div>
      </PageBody>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    draft: "badge-ink",
    ready: "badge-amber",
    generated: "badge-green",
  };

  return (
    <span className={`badge ${map[status] ?? "badge-ink"} capitalize`}>
      {status || "draft"}
    </span>
  );
}

function PlusIcon() {
  return <FilePlus size={17} />;
}

function iconClass(tone) {
  const map = {
    green:
      "flex h-12 w-12 items-center justify-center rounded-2xl border border-[#39FF88]/25 bg-[#39FF88]/10 text-[#39FF88]",
    amber:
      "flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-400/25 bg-yellow-400/10 text-yellow-300",
    rose:
      "flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/25 bg-red-400/10 text-red-300",
  };

  return map[tone] ?? map.green;
}

function pillClass(tone) {
  const map = {
    green: "badge-green",
    amber: "badge-amber",
    rose: "badge-rose",
  };

  return map[tone] ?? "badge-green";
}