/** Shared header for side panels — participants | meeting chat | stream chat */
export default function PanelHeader({ label, subtitle, variant = "participants" }) {
  const chat = variant === "chat";
  const stream = variant === "stream";

  let headerClass =
    "shrink-0 border-b px-4 py-3 backdrop-blur-sm bg-gradient-to-r from-slate-100 to-slate-50/90 border-slate-300/80";
  let barClass = "mb-1 h-0.5 w-8 rounded-full bg-slate-500";
  let labelClass =
    "text-[0.65rem] font-bold uppercase tracking-[0.12em] text-slate-500";
  let subtitleClass = "mt-0.5 truncate text-sm font-semibold leading-tight text-slate-800";

  if (stream) {
    headerClass =
      "shrink-0 border-b border-warning/30 bg-gradient-to-r from-warning/15 via-warning/10 to-base-100 px-4 py-3 backdrop-blur-sm";
    barClass = "mb-1 h-0.5 w-8 rounded-full bg-warning";
    labelClass =
      "text-[0.65rem] font-bold uppercase tracking-[0.12em] text-warning/90";
    subtitleClass =
      "mt-0.5 truncate text-sm font-semibold leading-tight text-base-content";
  } else if (chat) {
    headerClass =
      "shrink-0 border-b border-primary/25 bg-gradient-to-r from-primary/12 via-primary/8 to-base-100 px-4 py-3 backdrop-blur-sm";
    barClass = "mb-1 h-0.5 w-8 rounded-full bg-primary";
    labelClass =
      "text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary/80";
    subtitleClass =
      "mt-0.5 truncate text-sm font-semibold leading-tight text-base-content";
  }

  return (
    <div className={headerClass}>
      <div className={barClass} aria-hidden />
      <h3 className={labelClass}>{label}</h3>
      {subtitle != null && subtitle !== "" && (
        <p
          className={subtitleClass}
          title={typeof subtitle === "string" ? subtitle : undefined}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
