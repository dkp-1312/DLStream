import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const activeStreams=new Map();

function startFFmpeg(streamKey,watchScript) {
  
  if(activeStreams.has(streamKey))
  {
    console.log("⚠️ FFmpeg already running for:", streamKey);
    return;
  }
  
  const outputDir = path.join(__dirname, "hls", watchScript);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const args = [
    "-i",
    `rtmp://127.0.0.1/live/${streamKey}`,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-c:a",
    "aac",
    "-f",
    "hls",
    "-hls_time",
    "2",
    "-hls_list_size",
    "5",
    "-hls_flags",
    "delete_segments",
    path.join(outputDir, "index.m3u8"),
  ];

  console.log("🎥 Starting FFmpeg for:", watchScript);

  const ffmpeg = spawn("ffmpeg", args);

  activeStreams.set(streamKey,{
    process:ffmpeg,
    outputDir,
  });

  ffmpeg.stderr.on("data", (data) => {
    console.log(`FFmpeg[${streamKey}]: ${data}`);
  });

  ffmpeg.on("close", () => {
    console.log("❌ Stream ended:", watchScript);
    console.log("❌ FFmpeg closed for:", streamKey);
    cleanupStream(streamKey);
  });
}

function stopFFmpeg(streamKey)
{
  const stream=activeStreams.get(streamKey);

  if(!stream) return;
  console.log("🛑 Stopping FFmpeg for:", streamKey);

  stream.processs.kill("SIGKILL");
  cleanupStream(streamKey);
}

function cleanupStream(streamKey)
{
  const stream=activeStreams.get(streamKey);
  if(!stream) return;

  if(fs.existsSync(stream.outputDir))
  {
    fs.rmSync(stream.outputDir,{recursive:true,force:true});
    console.log("🗑️ Deleted HLS folder:", stream.outputDir);
  }

  activeStreams.delete(streamKey);
}

export {startFFmpeg,stopFFmpeg};
