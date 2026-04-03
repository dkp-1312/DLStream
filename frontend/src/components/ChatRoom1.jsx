import ChatPanel from "./ChatPanel.jsx";

/**
 * LiveKit meeting chat — same socket protocol, different room id & UI (mode="meeting").
 */
export default function ChatRoom1({ roomName }) {
  if (!roomName) return null;

  return <ChatPanel mode="meeting" roomName={roomName} />;
}
