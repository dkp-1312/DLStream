import NodeMediaServer from "node-media-server";
import {startFFmpeg,stopFFmpeg} from "./ffmpeg.js";
import {getStreamByKey} from "./controllers/streamController.js";
import {getMeetingByStreamKey} from "./controllers/meetingController1.js";

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
    host:'0.0.0.0',
    address:'0.0.0.0'
  }
};

const nms = new NodeMediaServer(config);

nms.on("postPublish",async (session) => {
  // Use 'streamPath' for the full string (e.g., /live/1debb5db...)
  // Use 'streamName' for just the key (e.g., 1debb5db...)
  
  const actualPath = session.streamPath;
  const streamKey = session.streamName;

  if (!actualPath || !streamKey) {
    console.warn("⚠️ Stream data missing in session object.");
    return;
  }

  console.log("📡 Stream started!");
  console.log("📍 Full Path:", actualPath);
  console.log("🔑 Stream Key:", streamKey);

  let watchScript;
  const stream=await getStreamByKey({params:{key:streamKey}});
  if (stream) {
    watchScript = stream.watchScript;
  } else {
    const meeting = await getMeetingByStreamKey(streamKey);
    if (meeting) {
      watchScript = meeting.watchScript;
    }
  }

  if (!watchScript) {
    console.warn("⚠️ Stream not found or missing watchScript.");
    return;
  }
  console.log("🎬 Using watchScript for HLS:", watchScript);
  // Pass the key to your FFmpeg function
  startFFmpeg(streamKey,watchScript);
});

nms.on("donePublish",(session)=>{
  const actualPath = session.streamPath;
  const streamKey = session.streamName;
  if (!actualPath || !streamKey) {
    console.warn("⚠️ Stream data missing in session object.");
    return;
  }

  console.log("📴 Stream stopped:", streamKey);

  stopFFmpeg(streamKey);
})


nms.run();
