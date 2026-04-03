import { useParticipants } from "@livekit/components-react";
import PanelHeader from "./PanelHeader.jsx";

export default function ParticipantsPanel() {
  const participants = useParticipants();

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-slate-50/95">
      <PanelHeader
        variant="participants"
        label="Participants"
        subtitle={`${participants.length} in room`}
      />
      <div className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain bg-slate-50/80 px-3 py-3">
        {participants.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300/80 bg-white/60 px-3 py-6 text-center text-sm text-slate-500">
            No one else yet
          </p>
        ) : (
          participants.map((p) => (
            <div
              key={p.sid}
              className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/90 px-3 py-2.5 shadow-sm ring-1 ring-slate-900/[0.04] transition hover:border-slate-300 hover:bg-white hover:shadow-md"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-600/15 text-sm font-bold text-slate-700"
                aria-hidden
              >
                {(p.identity || "?").slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                {p.identity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
