import { useParams } from "react-router-dom";
import ChatPanel from "./ChatPanel.jsx";

/**
 * Live stream / broadcast chat (socket room = stream key or watch script).
 * Distinct styling from meeting chat — see `ChatPanel` mode="stream".
 */
export default function ChatRoom({ roomName: roomNameProp }) {
  const { roomName: paramRoom } = useParams();
  const roomName = roomNameProp ?? paramRoom;

  if (!roomName) {
    return (
      <div className="rounded-xl border border-dashed border-warning/40 bg-warning/5 px-4 py-8 text-center text-sm text-base-content/65">
        Open a stream or use a chat link that includes a room name.
      </div>
    );
  }

  return <ChatPanel mode="stream" roomName={roomName} />;
}
