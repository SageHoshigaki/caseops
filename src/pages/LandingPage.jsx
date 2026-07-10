import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Command,
  Database,
  FileCheck2,
  FileOutput,
  Files,
  Fingerprint,
  Gauge,
  Layers3,
  Menu,
  MousePointer2,
  Network,
  ScanSearch,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";

const navigation = [
  { label: "Platform", href: "#platform" },
  { label: "Workflow", href: "#workflow" },
  { label: "Intelligence", href: "#intelligence" },
  { label: "Pricing", href: "/pricing" },
  { label: "Focus", href: "#focus" },
];

const workflowSteps = [
  {
    number: "01",
    icon: Upload,
    eyebrow: "Import",
    title: "Bring in the case data.",
    copy: "Upload a structured CSV or enter the matter manually. CaseOps organizes the client, attorney, defendant, jurisdiction, and violation data.",
  },
  {
    number: "02",
    icon: Braces,
    eyebrow: "Configure",
    title: "Apply the correct workflow.",
    copy: "Jurisdiction rules, organization preferences, attorney details, and defendant mappings are applied through predictable system logic.",
  },
  {
    number: "03",
    icon: ScanSearch,
    eyebrow: "Review",
    title: "Resolve only what needs attention.",
    copy: "CaseOps surfaces incomplete records, conflicting information, and missing requirements before documents are produced.",
  },
  {
    number: "04",
    icon: FileOutput,
    eyebrow: "Generate",
    title: "Produce the complete packet.",
    copy: "Create organized, jurisdiction-specific filing documents from one guided workflow without rebuilding the same matter repeatedly.",
  },
];

const platformStats = [
  { value: "40", label: "Cases imported" },
  { value: "36", label: "Ready to generate" },
  { value: "03", label: "Need information" },
  { value: "01", label: "Possible duplicate" },
];

const jurisdictionRows = [
  {
    state: "California",
    code: "CA",
    detail: "Central District",
    status: "Operational",
    progress: 100,
  },
  {
    state: "Georgia",
    code: "GA",
    detail: "Northern District",
    status: "Operational",
    progress: 100,
  },
  {
    state: "Florida",
    code: "FL",
    detail: "Configuration",
    status: "In development",
    progress: 64,
  },
];

const intelligenceItems = [
  {
    icon: Database,
    title: "Firm-informed retrieval",
    copy: "Retrieve approved arguments, historical matters, attorney preferences, and organization-specific legal language.",
  },
  {
    icon: Network,
    title: "Grounded legal reasoning",
    copy: "Connect matter facts with relevant precedent, case law, procedural rules, and jurisdiction-specific requirements.",
  },
  {
    icon: Sparkles,
    title: "Interactive drafting",
    copy: "Let attorneys direct, refine, reject, and approve drafting suggestions inside the production workflow.",
  },
];

const floatingTransition = {
  duration: 4,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
};

function MagneticButton({
  children,
  className = "",
  href = "#",
  variant = "primary",
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (event) => {
    const bounds = ref.current?.getBoundingClientRect();

    if (!bounds) return;

    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;

    setPosition({
      x: x * 0.16,
      y: y * 0.16,
    });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const styles =
    variant === "primary"
      ? "bg-[#39FF88] text-neutral-950 hover:bg-[#62FFA0]"
      : "border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]";

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={position}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 16,
      }}
      className={`group inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold tracking-[-0.02em] transition-colors ${styles} ${className}`}
    >
      <span>{children}</span>

      <ArrowUpRight
        size={17}
        strokeWidth={2}
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </motion.a>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#39FF88]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#39FF88] shadow-[0_0_18px_rgba(57,255,136,0.8)]" />
      {children}
    </div>
  );
}

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.045] mix-blend-soft-light"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function ProductPreview() {
  const statusRows = [
    {
      client: "Jordan Avery",
      district: "CACD",
      state: "CA",
      status: "Ready",
    },
    {
      client: "Morgan Ellis",
      district: "NDGA",
      state: "GA",
      status: "Review",
    },
    {
      client: "Taylor Brooks",
      district: "CACD",
      state: "CA",
      status: "Ready",
    },
    {
      client: "Cameron Hayes",
      district: "NDGA",
      state: "GA",
      status: "Ready",
    },
  ];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
        rotateX: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX: 0,
      }}
      transition={{
        duration: 1.1,
        delay: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative mx-auto mt-16 w-full max-w-[1180px] px-4 sm:px-6"
      style={{ perspective: 1600 }}
    >
      <div className="absolute -inset-10 rounded-[60px] bg-[#39FF88]/[0.035] blur-3xl" />

      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.12] bg-[#10110f] shadow-[0_40px_140px_rgba(0,0,0,0.75)]">
        <div className="flex h-11 items-center justify-between border-b border-white/[0.08] bg-white/[0.025] px-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#39FF88]/70" />
          </div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
            <Fingerprint size={12} />
            Secure workspace
          </div>

          <div className="w-[46px]" />
        </div>

        <div className="grid min-h-[650px] grid-cols-1 lg:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-white/[0.08] bg-[#0c0d0b] p-5 lg:flex lg:flex-col">
            <div className="mb-10 flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#39FF88] text-neutral-950">
                <Layers3 size={16} strokeWidth={2.5} />
              </div>

              <span className="text-sm font-semibold tracking-[-0.03em]">
                CASEOPS
              </span>
            </div>

            <div className="space-y-1.5">
              {[
                ["Dashboard", Gauge],
                ["Cases", Files],
                ["Imports", Upload],
                ["Documents", FileCheck2],
              ].map(([label, Icon], index) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs ${
                    index === 0
                      ? "bg-[#39FF88] text-neutral-950"
                      : "text-white/45"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-auto rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
              <div className="mb-2 flex items-center justify-between text-[10px] text-white/40">
                <span>Monthly production</span>
                <span>72%</span>
              </div>

              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "72%" }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    delay: 0.5,
                  }}
                  className="h-full rounded-full bg-[#39FF88]"
                />
              </div>

              <div className="mt-3 text-[11px] text-white/55">
                180 of 250 cases
              </div>
            </div>
          </aside>

          <main className="relative overflow-hidden p-5 sm:p-7 lg:p-9">
            <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#39FF88]/[0.035] blur-[100px]" />

            <div className="relative">
              <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Production overview
                  </div>

                  <h3 className="text-2xl font-medium tracking-[-0.05em] sm:text-3xl">
                    Good morning, Alex.
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white/70"
                  >
                    <Upload size={14} />
                    Import CSV
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#39FF88] px-3.5 py-2.5 text-xs font-semibold text-neutral-950"
                  >
                    <Zap size={14} />
                    New case
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
                {[
                  ["Total cases", "248", "+18 this month"],
                  ["Ready", "36", "Packets prepared"],
                  ["Needs attention", "03", "Missing information"],
                  ["Generated", "42", "This month"],
                ].map(([label, value, footer], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.08 + 0.15,
                    }}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4"
                  >
                    <div className="mb-7 text-[10px] uppercase tracking-[0.16em] text-white/35">
                      {label}
                    </div>

                    <div className="text-3xl font-medium tracking-[-0.06em] sm:text-4xl">
                      {value}
                    </div>

                    <div className="mt-2 text-[10px] text-white/35">
                      {footer}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-3 grid gap-3 xl:grid-cols-[1.5fr_0.8fr]">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025]">
                  <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
                    <div>
                      <div className="text-xs font-medium">Case production</div>

                      <div className="mt-0.5 text-[10px] text-white/35">
                        Current matters and document status
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-[10px] text-[#39FF88]"
                    >
                      View all
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-[9px] uppercase tracking-[0.14em] text-white/30">
                          <th className="px-4 py-3 font-medium">Client</th>
                          <th className="px-4 py-3 font-medium">District</th>
                          <th className="px-4 py-3 font-medium">State</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium" />
                        </tr>
                      </thead>

                      <tbody>
                        {statusRows.map((row, index) => (
                          <motion.tr
                            key={row.client}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: 0.35 + index * 0.08,
                            }}
                            className="border-b border-white/[0.05] last:border-0"
                          >
                            <td className="px-4 py-4 text-[11px] text-white/75">
                              {row.client}
                            </td>

                            <td className="px-4 py-4 text-[10px] text-white/35">
                              {row.district}
                            </td>

                            <td className="px-4 py-4 text-[10px] text-white/35">
                              {row.state}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`rounded-full px-2 py-1 text-[9px] ${
                                  row.status === "Ready"
                                    ? "bg-[#39FF88]/10 text-[#39FF88]"
                                    : "bg-amber-300/10 text-amber-200"
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>

                            <td className="px-4 py-4 text-right">
                              <ChevronRight
                                size={14}
                                className="ml-auto text-white/25"
                              />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                  <div className="mb-5">
                    <div className="text-xs font-medium">Action queue</div>

                    <div className="mt-0.5 text-[10px] text-white/35">
                      Items requiring attention
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      ["25 cases ready", "Generate packets", CheckCircle2],
                      ["3 missing addresses", "Resolve information", Circle],
                      [
                        "5 drafts awaiting review",
                        "Open review queue",
                        Sparkles,
                      ],
                    ].map(([title, copy, Icon], index) => (
                      <motion.div
                        key={title}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.4 + index * 0.1,
                        }}
                        className="group flex items-start gap-3 rounded-lg border border-white/[0.07] bg-white/[0.025] p-3 transition-colors hover:bg-white/[0.05]"
                      >
                        <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#39FF88]/10 text-[#39FF88]">
                          <Icon size={13} />
                        </div>

                        <div className="min-w-0">
                          <div className="text-[11px] text-white/75">
                            {title}
                          </div>

                          <div className="mt-0.5 text-[9px] text-white/30">
                            {copy}
                          </div>
                        </div>

                        <ArrowUpRight
                          size={12}
                          className="ml-auto mt-1 text-white/20 transition-colors group-hover:text-[#39FF88]"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-lg bg-[#39FF88] p-3.5 text-neutral-950">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-semibold">
                          Batch generation
                        </div>

                        <div className="mt-0.5 text-[9px] text-neutral-950/55">
                          25 cases prepared
                        </div>
                      </div>

                      <div className="grid h-7 w-7 place-items-center rounded-full bg-neutral-950 text-[#39FF88]">
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <motion.div
        animate={{ y: [-6, 8] }}
        transition={floatingTransition}
        className="absolute -left-1 top-[44%] hidden rounded-xl border border-white/10 bg-[#151613]/90 p-3 shadow-2xl backdrop-blur-xl md:block lg:-left-5"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#39FF88] text-neutral-950">
            <Check size={15} strokeWidth={3} />
          </div>

          <div>
            <div className="text-[10px] font-medium text-white/75">
              Validation complete
            </div>

            <div className="mt-0.5 text-[9px] text-white/35">
              36 matters ready
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [10, -8] }}
        transition={{
          ...floatingTransition,
          duration: 5,
          delay: 0.5,
        }}
        className="absolute -right-1 bottom-[20%] hidden rounded-xl border border-white/10 bg-[#151613]/90 p-3 shadow-2xl backdrop-blur-xl md:block lg:-right-6"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-[#39FF88]">
            <Files size={15} />
          </div>

          <div>
            <div className="text-[10px] font-medium text-white/75">
              Packet generated
            </div>

            <div className="mt-0.5 text-[9px] text-white/35">
              5 documents assembled
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  const heroRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroProgress, [0, 1], [0, 180]);
  const heroOpacity = useTransform(heroProgress, [0, 0.85], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.94]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090a08] font-sans text-[#f5f5ee] selection:bg-[#39FF88] selection:text-neutral-950">
      <NoiseOverlay />

      <motion.div
        className="fixed left-0 top-0 z-[120] h-[2px] w-full origin-left bg-[#39FF88]"
        style={{ scaleX }}
      />

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
          <nav className="flex h-14 items-center justify-between rounded-full border border-white/[0.09] bg-[#0d0e0c]/75 px-4 shadow-[0_10px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:px-5">
            <a href="/" className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#39FF88] text-neutral-950">
                <Layers3 size={16} strokeWidth={2.5} />
              </div>

              <span className="text-sm font-semibold tracking-[-0.04em]">
                CASEOPS
              </span>
            </a>

            <div className="hidden items-center gap-8 lg:flex">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group relative text-xs font-medium text-white/50 transition-colors hover:text-white"
                >
                  {item.label}

                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#39FF88] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <a
                href="/app"
                className="px-3 text-xs font-medium text-white/55 transition-colors hover:text-white"
              >
                Open workspace
              </a>

              <a
                href="/app"
                className="group inline-flex items-center gap-2 rounded-full bg-[#39FF88] px-4 py-2.5 text-xs font-semibold text-neutral-950 transition-colors hover:bg-[#62FFA0]"
              >
                Enter CaseOps
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((current) => !current);
              }}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white sm:hidden"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </nav>

          {menuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              className="mt-2 rounded-2xl border border-white/10 bg-[#10110f]/95 p-4 shadow-2xl backdrop-blur-xl sm:hidden"
            >
              <div className="flex flex-col">
                {navigation.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    className="border-b border-white/[0.07] py-3 text-sm text-white/60 last:border-0"
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href="/app"
                  className="mt-4 flex items-center justify-between rounded-xl bg-[#39FF88] px-4 py-3 text-sm font-semibold text-neutral-950"
                >
                  Enter CaseOps
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <main>
        <section
          ref={heroRef}
          className="relative min-h-screen overflow-hidden pb-20 pt-36 sm:pt-40"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-440px] h-[900px] w-[900px] -translate-x-1/2 rounded-full border border-[#39FF88]/[0.08]" />

            <div className="absolute left-1/2 top-[-340px] h-[700px] w-[700px] -translate-x-1/2 rounded-full border border-white/[0.04]" />

            <div className="absolute left-1/2 top-[-140px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#39FF88]/[0.055] blur-[140px]" />

            <div
              className="absolute inset-x-0 top-0 h-[800px] opacity-[0.13]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                maskImage: "linear-gradient(to bottom, black, transparent 78%)",
              }}
            />
          </div>

          <motion.div
            style={{
              y: heroY,
              opacity: heroOpacity,
              scale: heroScale,
            }}
            className="relative mx-auto max-w-[1320px] px-5 text-center sm:px-8"
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{ duration: 0.7 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#39FF88]/20 bg-[#39FF88]/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#39FF88]"
            >
              <Sparkles size={12} />
              Legal production, re-engineered
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 32,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto max-w-[1100px] text-[clamp(3.6rem,9vw,8.4rem)] font-medium leading-[0.86] tracking-[-0.075em]"
            >
              Case data in.
              <span className="block text-white/28">Legal work out.</span>
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 24,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto mt-8 max-w-[680px] text-base leading-7 text-white/48 sm:text-lg"
            >
              CaseOps transforms structured matter data into accurate,
              jurisdiction-specific legal production through one focused,
              predictable workflow.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 22,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <MagneticButton href="/app">Start producing cases</MagneticButton>

              <MagneticButton href="#workflow" variant="secondary">
                Explore the workflow
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex items-center justify-center gap-8 text-[10px] uppercase tracking-[0.18em] text-white/27"
            >
              <span>California</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Georgia</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Florida next</span>
            </motion.div>
          </motion.div>

          <ProductPreview />

          <div className="relative mx-auto mt-16 flex max-w-[1320px] justify-center px-6">
            <a
              href="#platform"
              className="flex flex-col items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-white/25"
            >
              Scroll to explore
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowDown size={15} />
              </motion.div>
            </a>
          </div>
        </section>

        <section
          id="platform"
          className="relative border-y border-white/[0.07] bg-[#0c0d0b] py-24 sm:py-32"
        >
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div>
                <SectionLabel>Production infrastructure</SectionLabel>

                <h2 className="mt-6 max-w-[600px] text-4xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                  Not another form builder.
                  <span className="block text-white/25">
                    A finished legal workflow.
                  </span>
                </h2>
              </div>

              <div className="flex flex-col justify-between">
                <p className="max-w-[680px] text-lg leading-8 text-white/45 sm:text-xl">
                  CaseOps knows the structure of the matter, the jurisdiction,
                  the parties, and the documents required. Teams operate the
                  workflow instead of constructing it.
                </p>

                <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08]">
                  {platformStats.map((stat) => (
                    <div key={stat.label} className="bg-[#0c0d0b] p-5 sm:p-7">
                      <div className="text-4xl font-medium tracking-[-0.06em] sm:text-5xl">
                        {stat.value}
                      </div>

                      <div className="mt-3 text-xs text-white/35">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-20 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#11120f]">
              <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                <div className="border-b border-white/[0.07] p-7 sm:p-10 lg:border-b-0 lg:border-r">
                  <div className="mb-14 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium">
                        Jurisdiction engine
                      </div>

                      <div className="mt-1 text-[11px] text-white/30">
                        Active workflow coverage
                      </div>
                    </div>

                    <div className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
                      <Command size={15} className="text-[#39FF88]" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {jurisdictionRows.map((row, index) => (
                      <motion.div
                        key={row.state}
                        initial={{
                          opacity: 0,
                          x: -20,
                        }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.1,
                        }}
                        className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"
                      >
                        <div className="mb-5 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-xs font-semibold text-white/65">
                              {row.code}
                            </div>

                            <div>
                              <div className="text-sm text-white/75">
                                {row.state}
                              </div>

                              <div className="mt-0.5 text-[10px] text-white/30">
                                {row.detail}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`text-[9px] ${
                              row.progress === 100
                                ? "text-[#39FF88]"
                                : "text-white/30"
                            }`}
                          >
                            {row.status}
                          </span>
                        </div>

                        <div className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${row.progress}%`,
                            }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1.1,
                              delay: 0.25 + index * 0.1,
                            }}
                            className="h-full rounded-full bg-[#39FF88]"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative min-h-[600px] overflow-hidden p-7 sm:p-10">
                  <div className="absolute right-[-120px] top-[-100px] h-[400px] w-[400px] rounded-full bg-[#39FF88]/[0.05] blur-[100px]" />

                  <div className="relative">
                    <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#39FF88]">
                      One matter. One source of truth.
                    </div>

                    <h3 className="max-w-[560px] text-3xl font-medium leading-[1.05] tracking-[-0.05em] sm:text-5xl">
                      Enter information once. Let it move through the entire
                      case.
                    </h3>

                    <div className="mt-12 grid gap-3 sm:grid-cols-2">
                      {[
                        ["Client", "Structured identity and address data"],
                        ["District", "Jurisdiction-specific production logic"],
                        ["Attorney", "Reusable organization configuration"],
                        ["Defendants", "Party and violation mapping"],
                        ["Review", "Cross-document validation"],
                        ["Generate", "Complete document assembly"],
                      ].map(([title, description], index) => (
                        <motion.div
                          key={title}
                          initial={{
                            opacity: 0,
                            y: 18,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{ once: true }}
                          transition={{
                            delay: index * 0.07,
                          }}
                          className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors hover:bg-white/[0.05]"
                        >
                          <div className="mb-9 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-[0.14em] text-white/30">
                              0{index + 1}
                            </span>

                            <Circle
                              size={12}
                              className="text-white/15 transition-colors group-hover:fill-[#39FF88] group-hover:text-[#39FF88]"
                            />
                          </div>

                          <div className="text-sm text-white/75">{title}</div>

                          <div className="mt-1.5 text-[11px] leading-5 text-white/30">
                            {description}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="relative py-24 sm:py-36">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <div>
                <SectionLabel>How CaseOps works</SectionLabel>

                <h2 className="mt-6 max-w-[780px] text-4xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                  A shorter distance between
                  <span className="block text-white/25">
                    information and execution.
                  </span>
                </h2>
              </div>

              <p className="max-w-[420px] text-sm leading-7 text-white/38">
                Predictable systems handle the repeatable work. Legal teams
                intervene where judgment and review matter.
              </p>
            </div>

            <div className="mt-16 border-t border-white/[0.09]">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.number}
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: "-80px",
                    }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group grid gap-6 border-b border-white/[0.09] py-8 transition-colors hover:bg-white/[0.018] sm:grid-cols-[80px_70px_1fr_1fr] sm:items-center sm:py-10"
                  >
                    <div className="text-xs text-white/25">{step.number}</div>

                    <div className="grid h-11 w-11 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.03] text-[#39FF88] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
                      <Icon size={18} />
                    </div>

                    <div>
                      <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#39FF88]">
                        {step.eyebrow}
                      </div>

                      <h3 className="text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
                        {step.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                      <p className="max-w-[500px] text-sm leading-7 text-white/38">
                        {step.copy}
                      </p>

                      <ArrowUpRight
                        size={20}
                        className="shrink-0 text-white/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#39FF88]"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="intelligence"
          className="relative overflow-hidden border-y border-white/[0.07] bg-[#39FF88] py-24 text-neutral-950 sm:py-36"
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, rgba(0,0,0,0.3) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-[1320px] px-5 sm:px-8">
            <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
                  Intelligence layer
                </div>

                <h2 className="mt-6 max-w-[680px] text-4xl font-medium leading-[0.95] tracking-[-0.06em] sm:text-7xl">
                  AI where legal judgment begins.
                </h2>

                <p className="mt-8 max-w-[600px] text-base leading-8 text-neutral-950/60 sm:text-lg">
                  The predictable system organizes the matter first. Then the
                  intelligence layer helps attorneys explore direction, retrieve
                  relevant authority, and draft informed legal work.
                </p>
              </div>

              <div className="space-y-3">
                {intelligenceItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{
                        opacity: 0,
                        x: 30,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.1,
                      }}
                      className="group rounded-2xl border border-neutral-950/15 bg-neutral-950/[0.055] p-5 backdrop-blur-sm transition-colors hover:bg-neutral-950/[0.1] sm:p-6"
                    >
                      <div className="flex items-start gap-5">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neutral-950 text-[#39FF88]">
                          <Icon size={18} />
                        </div>

                        <div>
                          <h3 className="text-xl font-medium tracking-[-0.04em]">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-7 text-neutral-950/58">
                            {item.copy}
                          </p>
                        </div>

                        <ArrowUpRight
                          size={18}
                          className="ml-auto shrink-0 opacity-30 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-20 overflow-hidden rounded-[26px] bg-neutral-950 text-white shadow-[0_30px_100px_rgba(0,0,0,0.22)]">
              <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                <div className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r">
                  <div className="mb-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#39FF88]">
                    <Sparkles size={13} />
                    Legal reasoning workspace
                  </div>

                  <h3 className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl">
                    The attorney remains in control.
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-white/38">
                    Suggestions remain traceable, reviewable, and connected to
                    the underlying case facts and sources.
                  </p>

                  <div className="mt-10 space-y-2">
                    {[
                      "Case facts",
                      "Organization precedent",
                      "Relevant case law",
                      "Attorney instructions",
                    ].map((label, index) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.035] px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] text-white/25">
                            0{index + 1}
                          </span>

                          <span className="text-xs text-white/60">{label}</span>
                        </div>

                        <CheckCircle2 size={14} className="text-[#39FF88]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative p-7 sm:p-10">
                  <div className="absolute right-[-100px] top-[-100px] h-[320px] w-[320px] rounded-full bg-[#39FF88]/[0.07] blur-[100px]" />

                  <div className="relative rounded-2xl border border-white/[0.1] bg-white/[0.035] p-5 sm:p-6">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div>
                        <div className="text-xs font-medium">
                          Suggested case direction
                        </div>

                        <div className="mt-1 text-[10px] text-white/30">
                          Generated from case facts and approved authority
                        </div>
                      </div>

                      <span className="rounded-full bg-[#39FF88]/10 px-2.5 py-1 text-[9px] text-[#39FF88]">
                        High relevance
                      </span>
                    </div>

                    <div className="py-6">
                      <div className="text-[10px] uppercase tracking-[0.16em] text-white/30">
                        Recommended focus
                      </div>

                      <h4 className="mt-3 text-xl font-medium leading-7 tracking-[-0.03em]">
                        Emphasize the repeated reinvestigation failure following
                        documented notice.
                      </h4>

                      <p className="mt-4 text-sm leading-7 text-white/40">
                        The current sequence contains two dispute events, a
                        supporting identity document, and continued reporting
                        after the second response.
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                      {[
                        "Review sources",
                        "Revise direction",
                        "Add to draft",
                      ].map((label, index) => (
                        <button
                          type="button"
                          key={label}
                          className={`rounded-lg px-3 py-3 text-[10px] font-medium ${
                            index === 2
                              ? "bg-[#39FF88] text-neutral-950"
                              : "border border-white/10 bg-white/[0.04] text-white/55"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                      <div className="mb-7 flex items-center justify-between">
                        <span className="text-[10px] text-white/35">
                          Sources reviewed
                        </span>

                        <BadgeCheck size={15} className="text-[#39FF88]" />
                      </div>

                      <div className="text-3xl font-medium tracking-[-0.05em]">
                        14
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                      <div className="mb-7 flex items-center justify-between">
                        <span className="text-[10px] text-white/35">
                          Missing facts
                        </span>

                        <MousePointer2 size={15} className="text-[#39FF88]" />
                      </div>

                      <div className="text-3xl font-medium tracking-[-0.05em]">
                        02
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="focus" className="py-24 sm:py-36">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <div className="rounded-[30px] border border-white/[0.08] bg-[#0f100e] p-7 sm:p-12 lg:p-16">
              <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-end">
                <div>
                  <SectionLabel>Focused by design</SectionLabel>

                  <h2 className="mt-6 max-w-[750px] text-4xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                    Built to optimize legal work.
                    <span className="block text-white/25">
                      Nothing more. Nothing less.
                    </span>
                  </h2>
                </div>

                <div>
                  <p className="text-base leading-8 text-white/40">
                    CaseOps does not replace intake, billing, communication, or
                    full case management. It integrates with the legal stack and
                    owns the production-heavy work between case data and
                    completed documents.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {[
                      "Case import",
                      "Jurisdiction logic",
                      "Legal drafting",
                      "Document generation",
                      "Packet review",
                      "Structured export",
                    ].map((label) => (
                      <span
                        key={label}
                        className="rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-2 text-[10px] text-white/45"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/[0.07] py-28 sm:py-40">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#39FF88]/[0.05] blur-[120px]" />

          <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8">
            <SectionLabel>Start producing differently</SectionLabel>

            <h2 className="mt-7 text-[clamp(3.2rem,8vw,7.8rem)] font-medium leading-[0.88] tracking-[-0.075em]">
              Less paperwork.
              <span className="block text-white/25">More legal output.</span>
            </h2>

            <p className="mx-auto mt-8 max-w-[580px] text-base leading-7 text-white/40">
              Move from repetitive case preparation to a focused legal
              production workflow.
            </p>

            <div className="mt-10 flex justify-center">
              <MagneticButton href="/app" className="px-8 py-4">
                Enter CaseOps
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] bg-[#080907]">
        <div className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#39FF88] text-neutral-950">
                <Layers3 size={16} strokeWidth={2.5} />
              </div>

              <span className="text-sm font-semibold tracking-[-0.04em]">
                CASEOPS
              </span>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] text-white/30">
              <a href="#platform" className="hover:text-white">
                Platform
              </a>

              <a href="#workflow" className="hover:text-white">
                Workflow
              </a>

              <a href="/pricing" className="hover:text-white">
                Pricing
              </a>

              <a href="mailto:hello@caseops.com" className="hover:text-white">
                Contact
              </a>
            </div>

            <div className="text-[10px] uppercase tracking-[0.16em] text-white/20">
              © {new Date().getFullYear()} CaseOps
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
