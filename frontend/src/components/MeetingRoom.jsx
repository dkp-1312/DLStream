import { LiveKitRoom } from "@livekit/components-react";
import { useState } from "react";
import Controls from "./Controls.jsx";
import ParticipantsPanel from "./ParticipantsPanel.jsx";
import ChatRoom1 from "./ChatRoom1.jsx";
import VideoGrid from "./VideoGrid.jsx";

export default function MeetingRoom({ token, url, roomName, onDisconnect }) {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect
      video
      audio
      className="flex flex-col h-screen bg-base-200 overflow-hidden"
      onDisconnected={onDisconnect}
    >
      
      {/* TOP NAV / ACTION BAR */}
      {/* Positioned absolutely so it doesn't break the flex layout, with high z-index */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 mt-12">
        <button
          className={`btn btn-sm shadow-md ${showParticipants ? "btn-primary" : "btn-outline bg-base-100"}`}
          onClick={() => setShowParticipants(!showParticipants)}
        >
          👥 Participants
        </button>
        <button
          className={`btn btn-sm shadow-md ${showChat ? "btn-primary" : "btn-outline bg-base-100"}`}
          onClick={() => setShowChat(!showChat)}
        >
          💬 Chat
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      {/* pt-16 ensures the top buttons have space and don't overlap videos */}
      <div className="flex flex-1 relative pt-5 w-full h-full">
        
        {/* Participants Panel (Left Side) */}
        {showParticipants && (
          <div className="w-1/4 max-w-xs bg-base-100 shadow-xl z-40 border-r border-base-300 h-full overflow-hidden">
            <ParticipantsPanel />
          </div>
        )}

        {/* Video Area (Center) */}
        <div className="flex-1 bg-black/5 relative h-full">
          <VideoGrid />
        </div>

        {/* Chat Sidebar (Right Side) */}
        {showChat && (
          <div className="w-1/3 max-w-sm bg-base-100 shadow-xl z-40 border-l border-base-300 h-full overflow-hidden">
            <ChatRoom1 roomName={roomName} />
          </div>
        )}

      </div>

      {/* BOTTOM CONTROLS */}
      {/* Since Controls has fixed bottom-0, the pb-24 in VideoGrid protects the UI */}
      <Controls onDisconnect={onDisconnect} />

    </LiveKitRoom>
  );
}