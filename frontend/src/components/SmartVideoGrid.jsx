import {
    useTracks,
    useParticipants
  } from "@livekit/components-react";
  
  import { useState, useMemo } from "react";
  import VideoTile from "./VideoTile";
  
  export default function SmartVideoGrid() {
  
    const tracks = useTracks([
      { source: "camera" },
      { source: "screen_share" }
    ]);
  
    const participants = useParticipants();
  
    const [page, setPage] = useState(0);
    const [pinned, setPinned] = useState(null);
    const [gridMode, setGridMode] = useState(false);
  
    const pageSize = 4;
  
    // 🔥 ACTIVE SPEAKER
    const activeSpeaker = useMemo(() => {
      return participants.find(p => p.isSpeaking);
    }, [participants]);
  
    // Decide main track
    const mainTrack = pinned || tracks.find(
      t => t.participant === activeSpeaker
    );
  
    const otherTracks = tracks.filter(t => t !== mainTrack);
  
    const paginated = otherTracks.slice(
      page * pageSize,
      page * pageSize + pageSize
    );
  
    return (
      <div className="w-full h-full flex flex-col">
  
        {/* TOP BAR */}
        <div className="flex justify-between p-2">
  
          <h3 className="font-bold">Meeting</h3>
  
          <button
            className="btn btn-sm"
            onClick={() => setGridMode(!gridMode)}
          >
            {gridMode ? "Speaker View" : "Grid View"}
          </button>
  
        </div>
  
        {/* 🔥 GRID MODE */}
        {gridMode ? (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 flex-1">
  
            {tracks.slice(0, 4).map((t, i) => (
              <VideoTile key={i} track={t} onPin={setPinned} />
            ))}
  
          </div>
        ) : (
          // 🔥 SPEAKER MODE
          <div className="flex flex-1">
  
            {/* MAIN VIDEO */}
            <div className="flex-1 p-2">
              {mainTrack && (
                <VideoTile track={mainTrack} onPin={setPinned} />
              )}
            </div>
  
            {/* SIDE VIDEOS */}
            <div className="w-64 flex flex-col gap-2 p-2">
  
              {paginated.map((t, i) => (
                <VideoTile key={i} track={t} onPin={setPinned} />
              ))}
  
              {/* PAGINATION */}
              <div className="flex justify-between">
  
                <button
                  className="btn btn-xs"
                  onClick={() => setPage(Math.max(0, page - 1))}
                >
                  ◀
                </button>
  
                <button
                  className="btn btn-xs"
                  onClick={() => setPage(page + 1)}
                >
                  ▶
                </button>
  
              </div>
  
            </div>
  
          </div>
        )}
  
      </div>
    );
  }