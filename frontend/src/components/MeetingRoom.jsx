import { LiveKitRoom } from "@livekit/components-react";
import { useMemo, useState } from "react";
import Controls from "./Controls.jsx";
import ParticipantsPanel from "./ParticipantsPanel.jsx";
import ChatRoom1 from "./ChatRoom1.jsx";
import VideoGrid from "./VideoGrid.jsx";
import { joinMeetingUrl, shareOrCopyLink } from "../utils/shareLink";

export default function MeetingRoom({
  token,
  url,
  roomName,
  isHost,
  isOwner,
  initialIsLive,
  onDisconnect,
}) {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  const shareUrl = useMemo(() => joinMeetingUrl(roomName), [roomName]);

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect
      video={isHost}
      audio={isHost}
      className="flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden bg-gradient-to-b from-slate-300 via-slate-400/95 to-slate-500/90"
      onDisconnected={onDisconnect}
    >
      <div className="absolute right-4 top-4 z-50 mt-12 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          className="btn btn-sm gap-1 rounded-full border border-base-300/80 bg-base-100/95 px-4 font-semibold text-base-content shadow-md backdrop-blur-sm hover:bg-base-100"
          onClick={() =>
            shareOrCopyLink(shareUrl, { title: "Join this meeting" })
          }
        >
          <span aria-hidden>🔗</span>
          Share link
        </button>
        <button
          type="button"
          className={`rounded-full border border-base-300/80 px-4 shadow-md backdrop-blur-sm transition-all ${
            showParticipants
              ? "btn btn-primary btn-sm border-primary"
              : "btn btn-sm border-base-300 bg-base-100/90 text-base-content hover:bg-base-100"
          }`}
          onClick={() => setShowParticipants(!showParticipants)}
        >
          👥 Participants
        </button>
        <button
          type="button"
          className={`rounded-full border border-base-300/80 px-4 shadow-md backdrop-blur-sm transition-all ${
            showChat
              ? "btn btn-primary btn-sm border-primary"
              : "btn btn-sm border-base-300 bg-base-100/90 text-base-content hover:bg-base-100"
          }`}
          onClick={() => setShowChat(!showChat)}
        >
          💬 Chat
        </button>
      </div>

      <div className="relative flex min-h-0 w-full flex-1 pt-5">
        {showParticipants && (
          <div className="z-40 flex h-full min-h-0 w-1/4 max-w-xs shrink-0 flex-col overflow-hidden border-r border-slate-400/50 bg-slate-100 shadow-[4px_0_28px_rgba(0,0,0,0.18)]">
            <ParticipantsPanel />
          </div>
        )}

        <div className="relative h-full min-h-0 min-w-0 flex-1 overflow-hidden bg-gradient-to-br from-neutral to-black">
          <VideoGrid />
        </div>

        {showChat && (
          <div className="z-40 flex h-full min-h-0 w-1/3 max-w-sm shrink-0 flex-col overflow-hidden border-l border-primary/35 bg-base-100 shadow-[-4px_0_28px_rgba(2,132,199,0.12)]">
            <ChatRoom1 roomName={roomName} />
          </div>
        )}
      </div>

      <Controls
        onDisconnect={onDisconnect}
        isHost={isHost}
        isOwner={isOwner}
        initialIsLive={initialIsLive}
        roomName={roomName}
      />
    </LiveKitRoom>
  );
}
