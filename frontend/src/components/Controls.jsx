import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { useState } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { socket } from "../socket.js";
export default function Controls({
  onDisconnect,
  isHost,
  isOwner,
  initialIsLive,
  roomName,
  onLiveChange,
}) {
  const {
    localParticipant,
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
  } = useLocalParticipant();

  const room = useRoomContext();
  const [isLive, setIsLive] = useState(initialIsLive);

  const toggleMic = async () => {
    if (localParticipant)
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  };

  const toggleCam = async () => {
    if (localParticipant)
      await localParticipant.setCameraEnabled(!isCameraEnabled);
  };

  const shareScreen = async () => {
    if (localParticipant)
      await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
  };

  const toggleLive = async () => {
    try {
      const res = await API.put(`/meeting1/live/${roomName}`);
      setIsLive(res.data.isLive);
      if (onLiveChange) onLiveChange(res.data.isLive);
      socket.emit("liveStatusChanged", { room: roomName, isLive: res.data.isLive });
    } catch (error) {
      toast.error("Failed to change live status");
      console.error(error);
    }
  };

  const endCall = () => {
    room.disconnect();
    if (onDisconnect) onDisconnect();
  };

  return (
    <div className=" bottom-0 left-0 right-0 z-50 border-t border-base-300/60 bg-base-100/95 px-3 py-3 shadow-[0_-4px_24px_rgba(15,23,42,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-base-100/85 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-h-[2.5rem] flex-1 items-center justify-center sm:justify-start">
          {isOwner && (
            <button
              type="button"
              className={`btn btn-sm font-semibold sm:btn-md ${isLive ? "btn-error animate-pulse" : "btn-success"
                }`}
              onClick={toggleLive}
            >
              {isLive ? "Stop broadcast" : "Go live"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {isHost ? (
            <>
              <button
                type="button"
                className={`btn btn-circle btn-sm sm:btn-md ${isMicrophoneEnabled ? "btn-success" : "btn-neutral text-base-100"
                  }`}
                onClick={toggleMic}
                title={isMicrophoneEnabled ? "Mute" : "Unmute"}
                aria-pressed={isMicrophoneEnabled}
              >
                {isMicrophoneEnabled ? "🎤" : "🔇"}
              </button>
              <button
                type="button"
                className={`btn btn-circle btn-sm sm:btn-md ${isCameraEnabled ? "btn-success" : "btn-neutral text-base-100"
                  }`}
                onClick={toggleCam}
                title={isCameraEnabled ? "Camera off" : "Camera on"}
                aria-pressed={isCameraEnabled}
              >
                {isCameraEnabled ? "📷" : "🚫"}
              </button>
              <button
                type="button"
                className={`btn btn-sm font-semibold sm:btn-md ${isScreenShareEnabled ? "btn-warning" : "btn-info"
                  }`}
                onClick={shareScreen}
              >
                {isScreenShareEnabled ? "Stop share" : "Share screen"}
              </button>
            </>
          ) : (
            <p className="rounded-lg bg-base-200 px-4 py-2 text-center text-sm font-medium text-base-content/70">
              View-only — host controls media
            </p>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center sm:justify-end">
          <button
            type="button"
            className="btn btn-error btn-sm font-bold sm:btn-md"
            onClick={endCall}
          >
            {isHost ? "End for everyone" : "Leave"}
          </button>
        </div>
      </div>
    </div>
  );
}
