import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "peerjs";
import io from "socket.io-client";
import { toast } from "react-hot-toast";
const socket = io(import.meta.env.VITE_API_URL);

export default function MeetingRoom() {
  const { meetingId: id } = useParams();
  const navigate = useNavigate();
  const videoGrid = useRef();

  const [myStream, setMyStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const peerInstance = useRef(null);
  const calls = useRef([]);

  function stopAllTracks(stream) {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.autoplay = true;
    video.className = "aspect-video w-full rounded-lg bg-neutral object-cover";

    video.addEventListener("loadedmetadata", () => {
      video.play().catch((error) => {
        console.error("Autoplay was prevented:", error);
      });
    });

    if (videoGrid.current) {
      videoGrid.current.append(video);
    }
  }

  useEffect(() => {
    let activeStream = null;

    const peer = new Peer(undefined, {
      host: "localhost",
      port: 9000,
      path: "/peerjs",
    });
    peerInstance.current = peer;

    const myVideo = document.createElement("video");
    myVideo.muted = true;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        activeStream = stream;
        setMyStream(stream);
        addVideoStream(myVideo, stream);

        peer.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
          calls.current.push(call);
        });

        socket.on("user-connected", (userId) => {
          const call = peer.call(userId, stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
          calls.current.push(call);
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
        toast.error("Please allow camera and microphone access to join the meeting.");
      });

    peer.on("open", (userId) => {
      socket.emit("join-room", id, userId);
    });

    socket.on("user-disconnected", (userId) => {
      console.log("User disconnected:", userId);
    });

    return () => {
      stopAllTracks(activeStream);
      socket.disconnect();
      peer.destroy();
    };
  }, [id]);

  const toggleCamera = () => {
    if (!myStream) return;
    const videoTrack = myStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMute = () => {
    if (!myStream) return;
    const audioTrack = myStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const leaveMeeting = () => {
    stopAllTracks(myStream);
    calls.current.forEach((call) => call.close());
    if (peerInstance.current) peerInstance.current.destroy();
    socket.emit("leave-room", id);
    navigate("/");
  };

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col bg-base-200">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:py-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-base-content sm:text-2xl">
            Meeting room
          </h1>
          <p className="mt-1 text-sm text-base-content/65">Peer connection (legacy)</p>
        </div>

        <div className="sticky top-14 z-10 flex flex-wrap gap-2 rounded-xl border border-base-300/80 bg-base-100 p-3 shadow-soft">
          <button
            type="button"
            className={`btn btn-sm font-semibold sm:btn-md ${
              isCameraOn ? "btn-neutral text-base-100" : "btn-error"
            }`}
            onClick={toggleCamera}
          >
            {isCameraOn ? "Camera on" : "Camera off"}
          </button>
          <button
            type="button"
            className={`btn btn-sm font-semibold sm:btn-md ${
              isMuted ? "btn-error" : "btn-neutral text-base-100"
            }`}
            onClick={toggleMute}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            className="btn btn-error btn-sm font-bold sm:btn-md"
            onClick={leaveMeeting}
          >
            Leave
          </button>
        </div>

        <div
          ref={videoGrid}
          className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </main>
  );
}
