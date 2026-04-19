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
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        controls={true}
        autoPlay
        playsInline
        className="w-full h-full object-contain bg-black rounded-lg"
      />
    </div>
  );
}
