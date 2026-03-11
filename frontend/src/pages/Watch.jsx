import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { useParams } from "react-router-dom";

export default function Watch() {
  const videoRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    const hls = new Hls();

    // Replace this URL with your HLS stream URL
    const hlsStreamUrl = `http://localhost:5173/live/${id}/index.m3u8`;

    if (Hls.isSupported()) {
      hls.loadSource(hlsStreamUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("HLS manifest loaded, starting playback...");
        videoRef.current.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari browsers
      videoRef.current.src = hlsStreamUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }

    return () => {
      hls.destroy();
    };
  }, [id]);

  return (
    <div>
      <h2>👀 Watching Live Stream</h2>
      <video ref={videoRef} controls width="600" />
    </div>
  );
}