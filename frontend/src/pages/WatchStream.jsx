import { useParams } from "react-router-dom";
import HLSPlayer from "../components/HLSPlayer";
import ChatRoom from "../components/ChatRoom";
import { shareOrCopyLink, watchStreamUrl } from "../utils/shareLink";

export default function WatchStream() {
  const { key } = useParams();
  const shareUrl = watchStreamUrl(key);
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:gap-6">
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-base-content">
            Watching stream
            <span className="ml-2 font-mono text-base font-semibold text-primary">
              {key}
            </span>
          </h2>
          <button
            type="button"
            className="btn btn-outline btn-sm gap-2 border-base-300 bg-base-100 font-semibold shadow-sm"
            onClick={() =>
              shareOrCopyLink(shareUrl, { title: "Watch this stream" })
            }
          >
            <span aria-hidden>🔗</span>
            Share link
          </button>
        </div>

        <HLSPlayer url={`http://localhost:3000/hls/${key}/index.m3u8`} />
      </div>

      <div className="divider lg:divider-horizontal hidden lg:flex" />

      <div className="flex w-full min-w-0 flex-col lg:max-w-md lg:shrink-0">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-warning/35 bg-base-100/95 shadow-lg lg:h-[calc(100dvh-12rem)] lg:min-h-[420px]">
          <ChatRoom roomName={key} />
        </div>
      </div>
    </div>
  );
}
