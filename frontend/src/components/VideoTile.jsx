import { ParticipantTile } from "@livekit/components-react";
import { useState } from "react";

export default function VideoTile({ track, onPin }) {

  const [full, setFull] = useState(false);

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden ${
        full ? "fixed inset-0 z-50" : ""
      }`}
    >
      <ParticipantTile trackRef={track} />

      {/* Controls */}
      <div className="absolute bottom-2 right-2 flex gap-2">

        {/* Fullscreen */}
        <button
          className="btn btn-xs"
          onClick={() => setFull(!full)}
        >
          ⛶
        </button>

        {/* Pin */}
        <button
          className="btn btn-xs"
          onClick={() => onPin(track)}
        >
          📌
        </button>

      </div>
    </div>
  );
}