import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useMemo, useState, useEffect } from "react";
import { socket } from "../socket";
import Controls from "./Controls.jsx";
import ParticipantsPanel from "./ParticipantsPanel.jsx";
import ChatRoom1 from "./ChatRoom1.jsx";
import VideoGrid from "./VideoGrid.jsx";
import HLSPlayer from "./HLSPlayer.jsx";
import { joinMeetingUrl, shareOrCopyLink } from "../utils/shareLink";

export default function MeetingRoom({
  token,
  url,
  roomName,
  isHost,
  isOwner,
  initialIsLive,
  streamKey,
  watchScript,
  onDisconnect,
}) {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isLive, setIsLive] = useState(initialIsLive);
  const [showOBSModal, setShowOBSModal] = useState(false);
  const [watchOBS, setWatchOBS] = useState(initialIsLive);

  const shareUrl = useMemo(() => joinMeetingUrl(roomName), [roomName]);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", roomName);

    const handleLiveStatus = (newLiveStatus) => {
      setIsLive(newLiveStatus);
      if (newLiveStatus) {
        setWatchOBS(true);
      } else if (!isHost) {
        onDisconnect();
      }
    };

    socket.on("updateLiveStatus", handleLiveStatus);

    return () => {
      socket.off("updateLiveStatus", handleLiveStatus);
    };
  }, [roomName, isHost, onDisconnect]);

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
        {isOwner && (
          <button
            type="button"
            className="btn btn-sm btn-info gap-1 rounded-full px-4 font-semibold text-white shadow-md backdrop-blur-sm"
            onClick={() => setShowOBSModal(true)}
          >
            OBS Info
          </button>
        )}
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
          className={`rounded-full border border-base-300/80 px-4 shadow-md backdrop-blur-sm transition-all ${showParticipants
            ? "btn btn-primary btn-sm border-primary"
            : "btn btn-sm border-base-300 bg-base-100/90 text-base-content hover:bg-base-100"
            }`}
          onClick={() => setShowParticipants(!showParticipants)}
        >
          👥 Participants
        </button>
        <button
          type="button"
          className={`rounded-full border border-base-300/80 px-4 shadow-md backdrop-blur-sm transition-all ${showChat
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

        <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-br from-neutral to-black">
          <div className="flex-1 min-h-0 overflow-hidden">
            <VideoGrid watchOBS={watchOBS} watchScript={watchScript} />
          </div>
          
          <div className="absolute left-4 top-4 z-40 bg-black/50 px-3 py-1 rounded shadow-md backdrop-blur-sm">
             <label className="cursor-pointer label p-0 gap-2">
               <span className="label-text text-white font-bold">Watch OBS</span>
               <input type="checkbox" className="toggle toggle-primary toggle-sm" checked={watchOBS} onChange={(e) => setWatchOBS(e.target.checked)} />
             </label>
          </div>
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
        initialIsLive={isLive}
        roomName={roomName}
        onLiveChange={setIsLive}
      />
      
      {showOBSModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">OBS Streaming Info</h3>
            <p className="py-4 text-sm text-base-content/70">
              Use these details in OBS Studio to stream directly to this meeting via RTMP.
              Participants can toggle "Watch OBS" to view your stream.
            </p>
            <div className="form-control mb-2">
              <label className="label">
                <span className="label-text font-semibold">RTMP Server URL</span>
              </label>
              <input type="text" readOnly className="input input-bordered w-full" value="rtmp://localhost:1935/live" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Stream Key</span>
              </label>
              <input type="text" readOnly className="input input-bordered w-full" value={streamKey || ''} />
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowOBSModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
