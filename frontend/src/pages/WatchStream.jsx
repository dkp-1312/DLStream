import React from "react";
import { useParams } from "react-router-dom";
import HLSPlayer from "../components/HLSPlayer";
import ChatRoom from "../components/ChatRoom";

export default function WatchStream() {
  const { key } = useParams();

  return (<>
  <div className="flex w-full flex-col lg:flex-row">
    <div>
      <h2>Watching Stream: {key}</h2>

      <HLSPlayer url={`http://localhost:3000/hls/${key}/index.m3u8`} />
    </div>
    <div className="divider lg:divider-horizontal"></div>
    <ChatRoom roomName={key} />
    </div>
    </>
  );
}
