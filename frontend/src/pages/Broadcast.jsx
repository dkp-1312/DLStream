import { useEffect, useRef } from "react";
import { socket } from "../socket";
import { useParams } from "react-router-dom";

export default function Broadcast() {
  const videoRef = useRef();
  const peerRef = useRef();
  const { id } = useParams();

  useEffect(() => {
    socket.emit("join-stream", id);

    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      videoRef.current.srcObject = stream;

      peerRef.current = new RTCPeerConnection();

      stream.getTracks().forEach((track) => {
        peerRef.current.addTrack(track, stream);
      });

      peerRef.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            streamId: id,
            candidate: e.candidate,
          });
        }
      };

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);

      socket.emit("offer", { streamId: id, offer });
    };

    startCamera();

    socket.on("answer", async (answer) => {
      await peerRef.current.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await peerRef.current.addIceCandidate(candidate);
    });
  }, [id]);

  return (
    <div>
      <h2>🔴 Broadcasting Live</h2>
      <video ref={videoRef} autoPlay muted controls width="600" />
      <p>Share this link:</p>
      <code>http://localhost:5173/stream/{id}</code>
    </div>
  );
}
