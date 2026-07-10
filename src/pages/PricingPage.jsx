import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  FileStack,
  Layers3,
  Scale,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";

const plans = [
  {
    id: "solo",
    name: "Solo",
    eyebrow: "Independent practice",
    description:
      "A focused CaseOps workspace for one consumer-law professional producing cases independently.",
    monthlyPrice: 29,
    annualPrice: 23,
    users: "1 user",
    packets: "15 completed packets",
    overage: "$3 per additional packet",
    icon: UserRound,
    featured: false,
    cta: "Start Solo",
    features: [
      "All supported consumer-law workflows",
      "Manual case creation",
      "CSV case upload",
      "Saved attorneys and defendants",
      "Saved violations and recurring data",
      "Packet generation history",
      "Growing CaseOps form library",
    ],
  },
  {
    id: "micro",
    name: "Micro Firm",
    eyebrow: "Best for small teams",
    description:
      "The complete production workspace for an attorney and the person helping move cases forward.",
    monthlyPrice: 59,
    annualPrice: 47,
    users: "1–2 users",
    packets: "50 completed packets",
    overage: "$2 per additional packet",
    icon: UsersRound,
    featured: true,
    cta: "Choose Micro Firm",
    features: [
      "Everything in Solo",
      "Shared firm configuration",
      "Shared packet history",
      "Batch CSV import",
      "Reusable matter defaults",
      "Shared attorneys and defendants",
      "Standard workflow updates",
      "Email support",
    ],
  },
  {
    id: "boutique",
    name: "Boutique",
    eyebrow: "Established consumer-law firms",
    description:
      "Higher production capacity for boutique firms managing a larger and more consistent case pipeline.",
    monthlyPrice: 149,
    annualPrice: 119,
    users: "1–4 users",
    packets: "150 completed packets",
    overage: "$1.50 per additional packet",
    icon: Building2,
    featured: false,
    cta: "Choose Boutique",
    features: [
      "Everything in Micro Firm",
      "Higher batch-generation limits",
      "Advanced packet validation",
      "Priority workflow-expansion review",
      "Expanded organization settings",
      "Firm-wide production visibility",
      "Priority support",
    ],
  },
  {
    id: "intelligence",
    name: "Intelligence",
    eyebrow: "AI-assisted consumer law",
    description:
      "Transform approved matter data, public authority, and firm knowledge into guided legal production.",
    monthlyPrice: 499,
    annualPrice: 399,
    users: "1–4 users",
    packets: "300 completed packets",
    overage: "AI usage allowance included",
    icon: BrainCircuit,
    featured: false,
    cta: "Join Intelligence",
    features: [
      "Everything in Boutique",
      "Private firm knowledge base",
      "Consumer-law case direction",
      "Attorney-guided drafting",
      "Authority and precedent retrieval",
      "Interactive draft revisions",
      "Packet review assistance",
      "Monthly AI usage allowance",
    ],
  },
];

const comparisonRows = [
  {
    label: "Users",
    solo: "1",
    micro: "1–2",
    boutique: "1–4",
    intelligence: "1–4",
  },
  {
    label: "Completed packets",
    solo: "15 / month",
    micro: "50 / month",
    boutique: "150 / month",
    intelligence: "300 / month",
  },
  {
    label: "Consumer-law workflow library",
    solo: true,
    micro: true,
    boutique: true,
    intelligence: true,
  },
  {
    label: "CSV import",
    solo: true,
    micro: true,
    boutique: true,
    intelligence: true,
  },
  {
    label: "Shared firm configuration",
    solo: false,
    micro: true,
    boutique: true,
    intelligence: true,
  },
  {
    label: "Batch generation",
    solo: false,
    micro: true,
    boutique: true,
    intelligence: true,
  },
  {
    label: "Advanced validation",
    solo: false,
    micro: false,
    boutique: true,
    intelligence: true,
  },
  {
    label: "Private firm knowledge",
    solo: false,
    micro: false,
    boutique: false,
    intelligence: true,
  },
  {
    label: "AI-assisted drafting",
    solo: false,
    micro: false,
    boutique: false,
    intelligence: true,
  },
  {
    label: "Authority retrieval",
    solo: false,
    micro: false,
    boutique: false,
    intelligence: true,
  },
];

const faqItems = [
  {
    question: "What counts as one completed packet?",
    answer:
      "A packet is counted when CaseOps generates a completed filing set for one matter. Editing a matter or regenerating a corrected version does not automatically count as a separate new matter.",
  },
  {
    question: "What areas of law does CaseOps support?",
    answer:
      "CaseOps is built specifically for consumer-law production. The platform is not a general-purpose legal practice system.",
  },
  {
    question: "What happens when CaseOps adds new forms?",
    answer:
      "Standard supported forms and generalized consumer-law workflows are added to the shared CaseOps library. Active subscribers benefit from the expanding library according to their plan.",
  },
  {
    question: "What if my firm needs a form CaseOps has not seen yet?",
    answer:
      "CaseOps can review the requested form or court workflow as a workflow-expansion project. Simple additions may be incorporated quickly, while more complex jurisdiction logic may require a separate implementation quote.",
  },
  {
    question: "Is client information shared between firms?",
    answer:
      "No. Client records, internal strategy, private documents, attorney edits, and firm-specific knowledge remain isolated from other organizations.",
  },
  {
    question: "Does the Intelligence plan replace an attorney?",
    answer:
      "No. Intelligence is designed to assist licensed attorneys with research, drafting, retrieval, review, and production. Legal judgment and final approval remain with the attorney.",
  },
  {
    question: "Can larger firms use CaseOps?",
    answer:
      "Yes. Larger firms, multi-office operations, and teams requiring integrations can use an Enterprise deployment with negotiated volume, users, storage, support, and security requirements.",
  },
];

function BillingToggle({ annual, setAnnual }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/[0.035] p-1 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setAnnual(false)}
        className={`rounded-full px-5 py-2.5 text-xs font-bold transition ${
          !annual ? "bg-[#39FF88] text-black" : "text-white/40 hover:text-white"
        }`}
      >
        Monthly
      </button>

      <button
        type="button"
        onClick={() => setAnnual(true)}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition ${
          annual ? "bg-[#39FF88] text-black" : "text-white/40 hover:text-white"
        }`}
      >
        Annual
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] ${
            annual ? "bg-black/10 text-black" : "bg-[#39FF88]/10 text-[#39FF88]"
          }`}
        >
          Save 20%
        </span>
      </button>
    </div>
  );
}

function PlanCard({ plan, annual, index }) {
  const Icon = plan.icon;
  const price = annual ? plan.annualPrice : plan.monthlyPrice;

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.72,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative flex min-h-full flex-col overflow-hidden rounded-[30px] border p-6 ${
        plan.featured
          ? "border-[#39FF88] bg-[#39FF88] text-black shadow-[0_30px_100px_rgba(57,255,136,0.16)]"
          : "border-white/[0.08] bg-white/[0.025] text-white"
      }`}
    >
      {plan.featured && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.35),transparent_38%)]" />

          <div className="absolute right-5 top-5 rounded-full bg-black px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#39FF88]">
            Most popular
          </div>
        </>
      )}

      <div className="relative">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
            plan.featured
              ? "border-black/10 bg-black text-[#39FF88]"
              : "border-[#39FF88]/20 bg-[#39FF88]/10 text-[#39FF88]"
          }`}
        >
          <Icon size={19} />
        </div>

        <div
          className={`mt-8 text-[10px] font-black uppercase tracking-[0.2em] ${
            plan.featured ? "text-black/50" : "text-[#39FF88]"
          }`}
        >
          {plan.eyebrow}
        </div>

        <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
          {plan.name}
        </h2>

        <p
          className={`mt-4 min-h-[96px] text-sm leading-7 ${
            plan.featured ? "text-black/60" : "text-white/40"
          }`}
        >
          {plan.description}
        </p>

        <div className="mt-8 flex items-end gap-2">
          <span className="text-5xl font-black tracking-[-0.075em]">
            ${price}
          </span>

          <span
            className={`pb-1.5 text-xs ${
              plan.featured ? "text-black/45" : "text-white/30"
            }`}
          >
            / month
          </span>
        </div>

        <div
          className={`mt-2 text-[11px] ${
            plan.featured ? "text-black/45" : "text-white/30"
          }`}
        >
          {annual ? "Billed annually" : "Billed monthly"}
        </div>

        <div
          className={`mt-7 rounded-2xl border p-4 ${
            plan.featured
              ? "border-black/10 bg-black/[0.055]"
              : "border-white/[0.07] bg-black/20"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-black">{plan.users}</span>

            <UsersRound size={15} className="opacity-50" />
          </div>

          <div
            className={`mt-3 h-px ${
              plan.featured ? "bg-black/10" : "bg-white/[0.07]"
            }`}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-black">{plan.packets}</span>

            <FileStack size={15} className="opacity-50" />
          </div>

          <div
            className={`mt-2 text-[11px] ${
              plan.featured ? "text-black/50" : "text-white/30"
            }`}
          >
            {plan.overage}
          </div>
        </div>

        <div
          className={`my-7 h-px ${
            plan.featured ? "bg-black/10" : "bg-white/[0.07]"
          }`}
        />

        <div className="space-y-3">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  plan.featured
                    ? "bg-black text-[#39FF88]"
                    : "bg-[#39FF88]/10 text-[#39FF88]"
                }`}
              >
                <Check size={11} strokeWidth={3} />
              </span>

              <span
                className={`text-[13px] leading-5 ${
                  plan.featured ? "text-black/70" : "text-white/50"
                }`}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/app"
        className={`group relative mt-9 flex w-full items-center justify-between rounded-full px-5 py-4 text-sm font-black transition ${
          plan.featured
            ? "bg-black text-white hover:bg-[#101510]"
            : "bg-[#39FF88] text-black hover:bg-[#62FFA0]"
        }`}
      >
        {plan.cta}

        <ArrowUpRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </motion.article>
  );
}

function ComparisonValue({ value }) {
  if (value === true) {
    return (
      <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#39FF88]/10 text-[#39FF88]">
        <Check size={13} strokeWidth={3} />
      </span>
    );
  }

  if (value === false) {
    return <span className="text-white/15">—</span>;
  }

  return <span>{value}</span>;
}

function FAQItem({ item, open, onClick }) {
  return (
    <div className="border-b border-white/[0.07]">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-8 py-6 text-left"
      >
        <span className="text-base font-bold tracking-[-0.02em] text-white/80">
          {item.question}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-[#39FF88] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.28 }}
        className="overflow-hidden"
      >
        <p className="max-w-[760px] pb-6 text-sm leading-7 text-white/40">
          {item.answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white">
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
          <nav className="flex h-14 items-center justify-between rounded-full border border-white/[0.09] bg-black/75 px-4 shadow-[0_15px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:px-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#39FF88] text-black">
                <Scale size={15} strokeWidth={2.7} />
              </div>

              <span className="text-sm font-black tracking-[-0.04em]">
                CASEOPS
              </span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              <Link
                to="/"
                className="text-xs font-bold text-white/40 transition hover:text-white"
              >
                Platform
              </Link>

              <span className="text-xs font-bold text-[#39FF88]">Pricing</span>

              <a
                href="#compare"
                className="text-xs font-bold text-white/40 transition hover:text-white"
              >
                Compare
              </a>

              <a
                href="#faq"
                className="text-xs font-bold text-white/40 transition hover:text-white"
              >
                FAQ
              </a>
            </div>

            <Link
              to="/app"
              className="group flex items-center gap-2 rounded-full bg-[#39FF88] px-4 py-2.5 text-xs font-black text-black transition hover:bg-[#62FFA0]"
            >
              Enter CaseOps
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-520px] h-[950px] w-[950px] -translate-x-1/2 rounded-full border border-[#39FF88]/10" />

            <div className="absolute left-1/2 top-[-310px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#39FF88]/[0.055] blur-[150px]" />

            <div
              className="absolute inset-x-0 top-0 h-[800px] opacity-[0.12]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
                maskImage: "linear-gradient(to bottom, black, transparent 84%)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-[1320px] px-5 text-center sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#39FF88]/20 bg-[#39FF88]/[0.06] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#39FF88]"
            >
              <Sparkles size={12} />
              Consumer-law production
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto mt-7 max-w-[1050px] text-[clamp(3.5rem,8vw,7.8rem)] font-black leading-[0.87] tracking-[-0.078em]"
            >
              Start small.
              <span className="block text-white/20">Produce at scale.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mx-auto mt-8 max-w-[700px] text-base leading-8 text-white/42 sm:text-lg"
            >
              Every CaseOps plan gives consumer-law professionals access to a
              growing production system built around the forms, courts, claims,
              defendants, and workflows firms encounter in practice.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.34 }}
              className="mt-10"
            >
              <BillingToggle annual={annual} setAnnual={setAnnual} />
            </motion.div>
          </div>
        </section>

        <section className="pb-24 sm:pb-36">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  annual={annual}
                  index={index}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 flex flex-col gap-5 rounded-[26px] border border-white/[0.08] bg-white/[0.025] p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#39FF88]/20 bg-[#39FF88]/10 text-[#39FF88]">
                  <Layers3 size={18} />
                </div>

                <div>
                  <div className="text-sm font-black">
                    Need higher volume, more users, or integrations?
                  </div>

                  <p className="mt-1 max-w-[680px] text-xs leading-6 text-white/35">
                    Enterprise plans support high-volume consumer-law
                    operations, multiple offices, API access, custom retention,
                    dedicated onboarding, and negotiated AI capacity.
                  </p>
                </div>
              </div>

              <Link
                to="/app"
                className="group flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs font-black text-white transition hover:border-[#39FF88]/40 hover:text-[#39FF88]"
              >
                Discuss Enterprise
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#030603] py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#39FF88]">
                The CaseOps advantage
              </div>

              <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                Every firm expands
                <span className="block text-white/20">the production map.</span>
              </h2>

              <p className="mt-7 max-w-[560px] text-sm leading-7 text-white/40">
                CaseOps is focused exclusively on consumer law. As firms bring
                new courts, forms, defendants, claims, and workflow patterns
                into the system, the shared production library becomes more
                complete.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "More firms join",
                  body: "Consumer-law firms begin producing cases through the same structured system.",
                },
                {
                  number: "02",
                  title: "New workflows appear",
                  body: "CaseOps encounters new courts, forms, claim combinations, and filing requirements.",
                },
                {
                  number: "03",
                  title: "Logic is standardized",
                  body: "Public forms and generalized workflow rules are mapped into reusable production logic.",
                },
                {
                  number: "04",
                  title: "Every subscriber benefits",
                  body: "The growing library makes future onboarding faster and production more complete.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5"
                >
                  <div className="text-[10px] font-black tracking-[0.18em] text-[#39FF88]">
                    {item.number}
                  </div>

                  <h3 className="mt-5 text-lg font-black tracking-[-0.03em]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs leading-6 text-white/35">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="compare" className="scroll-mt-24 py-24 sm:py-36">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
            <div className="max-w-[800px]">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#39FF88]">
                Compare plans
              </div>

              <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                Choose the level
                <span className="block text-white/20">
                  your practice needs.
                </span>
              </h2>
            </div>

            <div className="mt-14 overflow-x-auto rounded-[26px] border border-white/[0.08]">
              <table className="w-full min-w-[940px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.025]">
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
                      Capability
                    </th>

                    {plans.map((plan) => (
                      <th
                        key={plan.id}
                        className="px-6 py-5 text-sm font-black"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-white/[0.06] last:border-0"
                    >
                      <td className="px-6 py-5 text-sm font-bold text-white/55">
                        {row.label}
                      </td>

                      <td className="px-6 py-5 text-center text-xs text-white/45">
                        <ComparisonValue value={row.solo} />
                      </td>

                      <td className="px-6 py-5 text-center text-xs text-white/45">
                        <ComparisonValue value={row.micro} />
                      </td>

                      <td className="px-6 py-5 text-center text-xs text-white/45">
                        <ComparisonValue value={row.boutique} />
                      </td>

                      <td className="px-6 py-5 text-center text-xs text-white/45">
                        <ComparisonValue value={row.intelligence} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-[#030603] py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-12 px-5 sm:px-8 lg:grid-cols-2">
            <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#39FF88]/20 bg-[#39FF88]/10 text-[#39FF88]">
                <ShieldCheck size={20} />
              </div>

              <h3 className="mt-7 text-3xl font-black tracking-[-0.05em]">
                Firm data stays private.
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/40">
                Client records, strategy, internal documents, attorney edits,
                settlement details, and private firm knowledge are isolated from
                every other organization.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-7 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#39FF88]/20 bg-[#39FF88]/10 text-[#39FF88]">
                <FileStack size={20} />
              </div>

              <h3 className="mt-7 text-3xl font-black tracking-[-0.05em]">
                Public workflows get stronger.
              </h3>

              <p className="mt-5 text-sm leading-7 text-white/40">
                Blank public forms, court requirements, generalized filing
                logic, public authority, and de-identified workflow corrections
                can improve the shared consumer-law production system.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-24 py-24 sm:py-36">
          <div className="mx-auto grid max-w-[1320px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#39FF88]">
                Common questions
              </div>

              <h2 className="mt-5 text-4xl font-black leading-[1] tracking-[-0.055em] sm:text-5xl">
                Clear pricing.
                <span className="block text-white/20">Focused product.</span>
              </h2>

              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 text-xs font-black text-[#39FF88]"
              >
                <ArrowLeft size={14} />
                Back to platform
              </Link>
            </div>

            <div className="border-t border-white/[0.08]">
              {faqItems.map((item, index) => (
                <FAQItem
                  key={item.question}
                  item={item}
                  open={openFAQ === index}
                  onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.07] py-28 sm:py-40">
          <div className="mx-auto max-w-[1080px] px-5 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#39FF88] text-black">
              <Scale size={19} />
            </div>

            <h2 className="mt-8 text-[clamp(3.2rem,7vw,6.8rem)] font-black leading-[0.88] tracking-[-0.072em]">
              Build the case.
              <span className="block text-white/20">Skip the repetition.</span>
            </h2>

            <p className="mx-auto mt-8 max-w-[620px] text-base leading-8 text-white/40">
              Start with the CaseOps plan that fits your current practice and
              move into higher-volume production and legal intelligence as your
              operation grows.
            </p>

            <Link
              to="/app"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#39FF88] px-7 py-4 text-sm font-black text-black transition hover:bg-[#62FFA0]"
            >
              Enter CaseOps
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] bg-[#020402]">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-7 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#39FF88] text-black">
              <Scale size={15} strokeWidth={2.7} />
            </div>

            <span className="text-sm font-black tracking-[-0.04em]">
              CASEOPS
            </span>
          </Link>

          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/20">
            Consumer-law production infrastructure
          </div>

          <div className="text-[10px] uppercase tracking-[0.16em] text-white/20">
            © {new Date().getFullYear()} CaseOps
          </div>
        </div>
      </footer>
    </div>
  );
}
