import { useTracks, ParticipantTile } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";

const PAGE_SIZE = 4;

function trackKey(track, i) {
  return track.publication?.trackSid ?? `${track.participant?.identity ?? "p"}-${i}`;
}

export default function VideoGrid() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  const [page, setPage] = useState(0);
  const [pinnedTrack, setPinnedTrack] = useState(null);
  const scrollRef = useRef(null);
  const pinnedContainerRef = useRef(null);

  const togglePinnedFullScreen = async (e) => {
    e.stopPropagation();
    if (!pinnedContainerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await pinnedContainerRef.current.requestFullscreen();
      } catch (err) {
        console.error(err);
      }
    } else {
      document.exitFullscreen();
    }
  };

  const pageCount = Math.max(1, Math.ceil(tracks.length / PAGE_SIZE));

  const pages = useMemo(() => {
    const out = [];
    for (let i = 0; i < pageCount; i++) {
      out.push(tracks.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE));
    }
    return out;
  }, [tracks, pageCount]);

  const isPinnedTrackActive =
    pinnedTrack &&
    tracks.some(
      (t) => t.publication?.trackSid === pinnedTrack.publication?.trackSid
    );

  const goToPage = useCallback(
    (next) => {
      const el = scrollRef.current;
      const clamped = Math.max(0, Math.min(pageCount - 1, next));
      if (el && el.clientWidth > 0) {
        el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
      }
      setPage(clamped);
    },
    [pageCount]
  );

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientWidth <= 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setPage((p) => (i !== p ? Math.max(0, Math.min(pageCount - 1, i)) : p));
  }, [pageCount]);

  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(0, pageCount - 1)));
  }, [pageCount]);

  const canPrev = pageCount > 1 && page > 0;
  const canNext = pageCount > 1 && page < pageCount - 1;

  return (
    <div className="relative h-full min-h-0 w-full">
      {pinnedTrack && isPinnedTrackActive ? (
        <div className="box-border flex h-full min-h-0 w-full gap-3 p-3 sm:gap-4 sm:p-4">
          <div ref={pinnedContainerRef} className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-neutral ring-1 ring-white/10 shadow-2xl [&_video]:!h-full [&_video]:!w-full [&_video]:!object-contain">
            <ParticipantTile trackRef={pinnedTrack} className="h-full w-full" />
            <button
              type="button"
              className="btn btn-error btn-sm absolute right-3 top-3 z-50 rounded-full shadow-lg"
              onClick={() => setPinnedTrack(null)}
            >
              Unpin
            </button>
            <button
              type="button"
              className="btn btn-circle btn-ghost btn-sm absolute right-3 bottom-3 z-50 border-0 bg-black/60 text-white backdrop-blur-sm transition-opacity hover:bg-black/80"
              onClick={togglePinnedFullScreen}
              title="Toggle Fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          </div>

          <div className="scrollbar-thin hidden min-h-0 w-1/3 shrink-0 flex-col gap-3 overflow-y-auto overscroll-contain pr-1 sm:flex md:w-1/4 lg:w-1/5">
            {tracks
              .filter(
                (t) => t.publication?.trackSid !== pinnedTrack.publication?.trackSid
              )
              .map((track, i) => (
                <VideoTile
                  key={trackKey(track, i)}
                  track={track}
                  onPin={() => setPinnedTrack(track)}
                  compact
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="relative h-full min-h-0 w-full">
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="scrollbar-thin flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {pages.map((pageTracks, pi) => (
              <div
                key={pi}
                className="box-border flex h-full min-h-0 w-full min-w-full shrink-0 snap-center snap-always flex-col px-3 pt-1 sm:px-4"
              >
                <div className="grid h-full min-h-0 w-full max-w-6xl grid-cols-1 grid-rows-2 gap-3 sm:mx-auto sm:grid-cols-2 sm:gap-4">
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => {
                    const track = pageTracks[i];
                    if (!track) {
                      return (
                        <div
                          key={`empty-${pi}-${i}`}
                          className="min-h-0 min-w-0 rounded-2xl bg-white/5 ring-1 ring-white/10"
                          aria-hidden
                        />
                      );
                    }
                    return (
                      <VideoTile
                        key={trackKey(track, pi * PAGE_SIZE + i)}
                        track={track}
                        onPin={() => setPinnedTrack(track)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {pageCount > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous page"
                disabled={!canPrev}
                className="btn btn-circle btn-sm absolute left-2 top-1/2 z-50 -translate-y-1/2 border-0 bg-base-100/95 text-base-content shadow-lg backdrop-blur-sm hover:bg-base-100 disabled:pointer-events-none disabled:opacity-35 sm:left-4 sm:btn-md"
                onClick={() => goToPage(page - 1)}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next page"
                disabled={!canNext}
                className="btn btn-circle btn-sm absolute right-2 top-1/2 z-50 -translate-y-1/2 border-0 bg-base-100/95 text-base-content shadow-lg backdrop-blur-sm hover:bg-base-100 disabled:pointer-events-none disabled:opacity-35 sm:right-4 sm:btn-md"
                onClick={() => goToPage(page + 1)}
              >
                ›
              </button>
              <div className="pointer-events-none absolute bottom-[5.5rem] left-1/2 z-40 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/45 px-2.5 py-1.5 backdrop-blur-sm">
                {pages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === page ? "w-4 bg-primary" : "w-1.5 bg-base-100/40"
                      }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function VideoTile({ track, onPin, compact }) {
  const isCameraOff = track.publication?.isMuted || !track.publication;
  let profilePic = "";
  if (track.participant?.metadata) {
    try {
      const meta = JSON.parse(track.participant.metadata);
      profilePic = meta.profilePic;
    } catch (e) { }
  }

  const containerRef = useRef(null);

  const toggleFullScreen = async (e) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error(err);
      }
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`group relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-2xl bg-neutral shadow-lg ring-1 ring-white/10 transition-shadow hover:ring-white/20 [&_video]:!h-full [&_video]:!w-full [&_video]:!object-contain ${compact ? "aspect-video w-full shrink-0" : "h-full w-full"
        }`}
    >
      <ParticipantTile trackRef={track} className="h-full w-full" />

      {isCameraOff && profilePic && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-base-300">
          <img src={profilePic} className="w-24 h-24 rounded-full object-cover shadow-xl border-4 border-base-100" alt="avatar" />
        </div>
      )}

      <button
        type="button"
        className="btn btn-circle btn-ghost btn-xs absolute right-2 top-2 z-50 border-0 bg-black/60 text-sm text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100"
        onClick={onPin}
        title="Pin video"
      >
        📌
      </button>

      <button
        type="button"
        className="btn btn-circle btn-ghost btn-xs absolute right-2 bottom-2 z-50 border-0 bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/80 group-hover:opacity-100"
        onClick={toggleFullScreen}
        title="Toggle Fullscreen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      </button>
    </div>
  );
}
