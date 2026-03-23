import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Peer from "peerjs";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function MeetingRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoGrid = useRef();
  
  const [myStream, setMyStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const peerInstance = useRef(null);
  const calls = useRef([]); // Track calls to close them properly

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: "localhost",
      port: 9000,
      path: "/peerjs"
    });
    peerInstance.current = peer;

    // 1. Create Local Video Element
    const myVideo = document.createElement("video");
    myVideo.muted = true; 

    // 2. Android/Mobile Specific Setup
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      setMyStream(stream);
      addVideoStream(myVideo, stream);

      peer.on("call", call => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", userVideoStream => {
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
    }).catch(err => {
      console.error("Failed to get local stream", err);
      alert("Please allow camera and microphone access to join the meeting.");
    });

    peer.on("open", (userId) => {
      socket.emit("join-room", id, userId);
    });

    socket.on("user-disconnected", (userId) => {
      console.log("User disconnected:", userId);
      // Logic to remove the specific video element would go here
    });

    return () => {
      stopAllTracks(myStream);
      socket.disconnect();
      peer.destroy();
    };
  }, [id]);

  // Modified for Android/Mobile support
  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    
    // CRITICAL FOR MOBILE:
    video.setAttribute("playsinline", "true"); 
    video.setAttribute("webkit-playsinline", "true");
    video.autoplay = true;

    video.addEventListener("loadedmetadata", () => {
      // Use a promise-based play to handle browser blocks
      video.play().catch(error => {
        console.error("Autoplay was prevented:", error);
      });
    });

    if (videoGrid.current) {
      videoGrid.current.append(video);
    }
  };

  const stopAllTracks = (stream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // --- Handlers ---

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
    calls.current.forEach(call => call.close());
    if (peerInstance.current) peerInstance.current.destroy();
    socket.emit("leave-room", id);
    navigate("/");
  };

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      <h2>Meeting Room</h2>
      
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", // Better for mobile screens
        gap: "8px", 
        marginBottom: "20px",
        background: "#f0f0f0",
        padding: "10px",
        borderRadius: "8px",
        position: "sticky", // Keep controls visible
        top: 0,
        zIndex: 10
      }}>
        <button onClick={toggleCamera} style={buttonStyle(isCameraOn ? "#64748b" : "#ef4444")}>
          {isCameraOn ? "📷 Off" : "📸 On"}
        </button>

        <button onClick={toggleMute} style={buttonStyle(isMuted ? "#ef4444" : "#64748b")}>
          {isMuted ? "🔇 Unmute" : "🎙️ Mute"}
        </button>

        <button onClick={leaveMeeting} style={buttonStyle("#b91c1c")}>
          📞 Leave
        </button>
      </div>

      <div
        ref={videoGrid}
        style={{
          display: "grid",
          // Adjust grid for mobile: 1 column on small screens, 2+ on larger
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "10px"
        }}
      />
    </div>
  );
}

const buttonStyle = (bgColor) => ({
  flex: "1 1 auto", // Buttons grow to fill space on mobile
  padding: "12px 8px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px"
});