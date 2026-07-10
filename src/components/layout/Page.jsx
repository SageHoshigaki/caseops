export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="relative overflow-hidden border-b border-[#102016] bg-black px-8 py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(57,255,136,0.10),transparent_32%)]" />

      <div className="relative flex items-start justify-between gap-6">
        <div>
          <p className="case-kicker mb-2">Case Analyzer</p>

          <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#A9B7AF]">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export function PageBody({ children, className }) {
  return (
    <div
      className={`relative flex-1 overflow-y-auto bg-black px-8 py-6 text-white ${
        className ?? ""
      }`}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(57,255,136,0.08),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(0,200,83,0.05),transparent_34%)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}