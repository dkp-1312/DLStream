import {
  LiveKitRoom
} from "@livekit/components-react";

import { useState } from "react";

import Controls from "./Controls";
import ParticipantsPanel from "./ParticipantsPanel";
import ChatRoom1 from "./ChatRoom1"; // ✅ YOUR EXISTING COMPONENT
import VideoGrid from "./Videogrid";

export default function MeetingRoom({ token, url ,roomName,onDisconnect}) {

  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect
      video
      audio
      style={{ height:"100vh"}}
      onDisconnected={onDisconnect}
    >

      <div className="flex h-full">
          {/* Participants Panel (Left Side) */}
          {showParticipants && (
          <div className="w-1/4 bg-white text-black p-4">
            <ParticipantsPanel />
          </div>
        )}

        {/* Video Area */}
        <div className="flex-1 bg-black">
          <VideoGrid />
        </div>

        {/* Sidebar */}
        {showChat && (
          <div className="w-1/3 bg-white text-black p-4">
            <ChatRoom1 roomName={roomName} />
          </div>
        )}

      </div>

      {/* Toggle Buttons */}
      <div className="fixed top-4 right-4 flex gap-2 mt-16">

        <button
          className="btn btn-sm"
          onClick={() => setShowParticipants(!showParticipants)}
        >
          👥
        </button>

        <button
          className="btn btn-sm"
          onClick={() => setShowChat(!showChat)}
        >
          💬
        </button>

      </div>

      <Controls onDisconnect={onDisconnect}/>

    </LiveKitRoom>
  );
}