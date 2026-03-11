import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function HLSPlayer({ url }) {
  const videoRef = useRef();

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url); 
      hls.attachMedia(videoRef.current);
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      style={{ width: "100%", borderRadius: "10px" }}
    />
  );
}
