import {
  useTracks,
  ParticipantTile
} from "@livekit/components-react";

import { useState } from "react";

export default function VideoGrid() {

  const tracks = useTracks([
    { source: "camera" },
    { source: "screen_share" }
  ]);

  const [page, setPage] = useState(0);

  const pageSize = 4;

  const totalPages = Math.ceil(tracks.length / pageSize);

  const currentTracks = tracks.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <div className="relative w-full h-full m-10">

      {/* GRID */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">

        {currentTracks.map((track, i) => (
          <VideoTile key={i} track={track} />
        ))}

      </div>

      {/* LEFT BUTTON */}
      {page > 0 && (
        <button
          className="btn btn-circle absolute left-2 top-1/2"
          onClick={() => setPage(page - 1)}
        >
          ◀
        </button>
      )}

      {/* RIGHT BUTTON */}
      {page < totalPages - 1 && (
        <button
          className="btn btn-circle absolute right-2 top-1/2"
          onClick={() => setPage(page + 1)}
        >
          ▶
        </button>
      )}

    </div>
  );
}


// 🔥 Individual Video Tile
function VideoTile({ track }) {

  const [full, setFull] = useState(false);

  return (
    <div
      className={`relative bg-black ${
        full ? "fixed inset-0 z-50" : ""
      }`}
    >

      <ParticipantTile trackRef={track} />

      {/* FULLSCREEN BUTTON */}
      {/* <button
        className="btn btn-xs absolute bottom-2 right-2"
        onClick={() => setFull(!full)}
      >
        ⛶
      </button> */}

    </div>
  );
}