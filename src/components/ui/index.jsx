import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, Info, XCircle, X } from "lucide-react";

export function WidgetPanel({ children, className }) {
  return (
    <div
      className={clsx(
        "rounded-[28px] border border-[#1B2E24] bg-[#0B1510]/88 p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:border before:border-white/[0.03]",
        "relative overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}

export function WidgetHeader({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-5">
      <div>
        <p className="case-kicker mb-2">{eyebrow}</p>
        <h3 className="text-xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A9B7AF]">{description}</p>}
      </div>
      {Icon && <div className="widget-icon shrink-0"><Icon size={17} /></div>}
    </div>
  );
}

export function SelCard({ selected, className, children, ...props }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      className={clsx(
        "group relative min-h-[170px] w-full overflow-hidden rounded-[26px] border p-5 text-left transition-all duration-300",
        "bg-[#07100B]/80 text-white shadow-[0_18px_60px_rgba(0,0,0,0.32)]",
        "hover:border-[#39FF88]/55 hover:bg-[#101F17]/95 hover:shadow-[0_22px_80px_rgba(0,0,0,0.42)]",
        selected
          ? "border-[#39FF88] bg-[#39FF88]/10 shadow-[0_0_0_1px_rgba(57,255,136,0.28),0_0_42px_rgba(57,255,136,0.14)]"
          : "border-[#1B2E24]",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_80%_0%,rgba(57,255,136,0.12),transparent_36%)]" />
      {selected && (
        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#39FF88] text-black shadow-[0_0_22px_rgba(57,255,136,0.45)]">
          <Check size={13} strokeWidth={3} />
        </div>
      )}
      <div className="relative">{children}</div>
    </motion.button>
  );
}

export function MultiCard({ selected, className, children, ...props }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      className={clsx(
        "group relative min-h-[175px] w-full overflow-hidden rounded-[26px] border p-5 text-left transition-all duration-300",
        "bg-[#07100B]/80 text-white shadow-[0_18px_60px_rgba(0,0,0,0.32)]",
        "hover:border-[#39FF88]/55 hover:bg-[#101F17]/95 hover:shadow-[0_22px_80px_rgba(0,0,0,0.42)]",
        selected
          ? "border-[#39FF88] bg-[#39FF88]/10 shadow-[0_0_0_1px_rgba(57,255,136,0.28),0_0_42px_rgba(57,255,136,0.14)]"
          : "border-[#1B2E24]",
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_80%_0%,rgba(57,255,136,0.12),transparent_36%)]" />
      <div
        className={clsx(
          "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border transition",
          selected
            ? "border-[#39FF88] bg-[#39FF88] text-black shadow-[0_0_22px_rgba(57,255,136,0.45)]"
            : "border-[#1B2E24] bg-black/30 text-[#6F7D75]"
        )}
      >
        {selected ? <Check size={13} strokeWidth={3} /> : "+"}
      </div>
      <div className="relative">{children}</div>
    </motion.button>
  );
}

export function Input({ label, hint, className, value, onChange, placeholder, ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input className={clsx("input", className)} value={value ?? ""} onChange={onChange} placeholder={placeholder} {...props} />
      {hint && <p className="mt-2 text-[11px] leading-5 text-[#6F7D75]">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, hint, className, value, onChange, placeholder, ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <textarea className={clsx("input min-h-[120px] resize-none", className)} value={value ?? ""} onChange={onChange} placeholder={placeholder} {...props} />
      {hint && <p className="mt-2 text-[11px] leading-5 text-[#6F7D75]">{hint}</p>}
    </div>
  );
}

export function Select({ label, hint, className, children, ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <select className={clsx("input", className)} {...props}>{children}</select>
      {hint && <p className="mt-2 text-[11px] leading-5 text-[#6F7D75]">{hint}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
        checked
          ? "border-[#39FF88]/50 bg-[#39FF88]/10 text-white"
          : "border-[#1B2E24] bg-[#07100B] text-[#A9B7AF] hover:border-[#39FF88]/40"
      )}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className={clsx("relative h-6 w-11 rounded-full transition", checked ? "bg-[#39FF88]" : "bg-[#1B2E24]")}>
        <span className={clsx("absolute top-1 h-4 w-4 rounded-full bg-black transition", checked ? "left-6" : "left-1 bg-[#6F7D75]")} />
      </span>
    </button>
  );
}

export function Alert({ type = "info", children, className }) {
  const config = {
    info:    { icon: Info,          classes: "border-[#39FF88]/25 bg-[#39FF88]/10 text-[#A9B7AF]",  iconClasses: "text-[#39FF88]" },
    warning: { icon: AlertTriangle, classes: "border-yellow-400/25 bg-yellow-400/10 text-yellow-100", iconClasses: "text-yellow-300" },
    error:   { icon: XCircle,       classes: "border-red-400/25 bg-red-400/10 text-red-100",          iconClasses: "text-red-300" },
  };
  const item = config[type] ?? config.info;
  const Icon = item.icon;
  return (
    <div className={clsx("flex items-start gap-3 rounded-[24px] border px-5 py-4 text-sm leading-6", item.classes, className)}>
      <Icon size={18} className={clsx("mt-0.5 shrink-0", item.iconClasses)} />
      <div>{children}</div>
    </div>
  );
}

export function ProgressBar({ value = 0, className }) {
  return (
    <div className={clsx("h-2 overflow-hidden rounded-full border border-[#1B2E24] bg-black/40", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="h-full rounded-full bg-[#39FF88] shadow-[0_0_24px_rgba(57,255,136,0.45)]"
      />
    </div>
  );
}

export function StatusPill({ tone = "neutral", children, className }) {
  const styles = {
    neutral: "border-[#1B2E24] bg-[#101F17] text-[#A9B7AF]",
    success: "border-[#39FF88]/35 bg-[#39FF88]/10 text-[#39FF88]",
    warning: "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
    danger:  "border-red-400/30 bg-red-400/10 text-red-300",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]", styles[tone], className)}>
      {children}
    </span>
  );
}

// ─── FIXED Modal — now properly renders title, children, and footer ──────────
export function Modal({ open, onClose, title, footer, children, wide }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className={clsx(
            "relative max-h-[85vh] overflow-hidden rounded-[28px] border border-[#1B2E24] bg-[#0B1510] text-white shadow-[0_30px_120px_rgba(0,0,0,0.75)]",
            wide ? "w-full max-w-3xl" : "w-full max-w-lg"
          )}
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(57,255,136,0.08),transparent_40%)]" />

          {/* Header */}
          {title && (
            <div className="relative flex items-center justify-between border-b border-[#1B2E24] px-6 py-4">
              <h2 className="text-lg font-semibold tracking-[-0.03em]">{title}</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#1B2E24] text-[#6F7D75] transition hover:border-[#39FF88]/40 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Body — scrollable */}
          <div className="relative max-h-[60vh] overflow-y-auto px-6 py-5">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="relative flex items-center justify-end gap-3 border-t border-[#1B2E24] px-6 py-4">
              {footer}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
