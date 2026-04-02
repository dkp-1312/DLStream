import { useTracks, ParticipantTile } from "@livekit/components-react";
import { useState } from "react";

export default function VideoGrid() {
  const tracks = useTracks([
    { source: "camera" },
    { source: "screen_share" }
  ]);

  const [page, setPage] = useState(0);
  const [pinnedTrack, setPinnedTrack] = useState(null);

  const pageSize = 4;
  const totalPages = Math.ceil(tracks.length / pageSize);

  // Get only the tracks for the current page (Max 4)
  const currentTracks = tracks.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  // Ensure the pinned track is still an active participant
  const isPinnedTrackActive = pinnedTrack && tracks.some(t => t.publication?.trackSid === pinnedTrack.publication?.trackSid);

  return (
    <div className="relative w-full h-full p-4 pb-24 flex items-center justify-center">
      
      {/* GRID LAYOUT */}
      {pinnedTrack && isPinnedTrackActive ? (
        <div className="flex w-full h-full gap-4">
          
          {/* MAIN PINNED VIDEO */}
          {/* The [&_video]:!object-contain forces LiveKit's inner video tag to never crop */}
          <div className="flex-grow h-full bg-black rounded-xl overflow-hidden relative shadow-lg flex items-center justify-center [&_video]:!object-contain [&_video]:!w-full [&_video]:!h-full">
            <ParticipantTile trackRef={pinnedTrack} className="w-full h-full" />
            <button
              className="btn btn-sm absolute top-4 right-4 z-50 btn-error shadow-md"
              onClick={() => setPinnedTrack(null)}
            >
              Unpin ❌
            </button>
          </div>

          {/* SIDEBAR VIDEOS */}
          <div className="w-1/3 md:w-1/4 lg:w-1/5 flex flex-col gap-4 overflow-y-auto hidden sm:flex">
            {currentTracks
              .filter((t) => t.publication?.trackSid !== pinnedTrack.publication?.trackSid)
              .map((track, i) => (
                <VideoTile key={i} track={track} onPin={() => setPinnedTrack(track)} />
              ))}
          </div>
        </div>
      ) : (
        /* STANDARD 2x2 GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 w-full h-full max-w-6xl">
          {currentTracks.map((track, i) => (
            <VideoTile key={i} track={track} onPin={() => setPinnedTrack(track)} />
          ))}
        </div>
      )}

      {/* LEFT PAGINATION BUTTON */}
      {page > 0 && (
        <button
          className="btn btn-circle absolute left-4 top-1/2 -translate-y-1/2 shadow-lg z-50"
          onClick={() => setPage(page - 1)}
        >
          ◀
        </button>
      )}

      {/* RIGHT PAGINATION BUTTON */}
      {page < totalPages - 1 && (
        <button
          className="btn btn-circle absolute right-4 top-1/2 -translate-y-1/2 shadow-lg z-50"
          onClick={() => setPage(page + 1)}
        >
          ▶
        </button>
      )}
    </div>
  );
}

// 🔥 Individual Video Tile
function VideoTile({ track, onPin }) {
  return (
    // [&_video]:!object-contain is applied here as well to fix the grid items on wide screens
    <div className="relative bg-black rounded-xl overflow-hidden shadow-md h-full w-full group flex items-center justify-center [&_video]:!object-contain [&_video]:!w-full [&_video]:!h-full">
      <ParticipantTile trackRef={track} className="w-full h-full" />

      {/* PIN BUTTON (Shows on hover) */}
      <button
        className="btn btn-sm btn-circle absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-black/50 text-white border-none hover:bg-black/80"
        onClick={onPin}
        title="Pin Video"
      >
        📌
      </button>
    </div>
  );
}