import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "peerjs";
import { socket } from "../socket";
import ChatRoom from "../components/ChatRoom.jsx";

const MeetingRoom = () => {
    const { meetingId } = useParams(); // Get the meeting ID from the URL
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [peerId, setPeerId] = useState(null);
    const [remotePeerId, setRemotePeerId] = useState(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        // Initialize PeerJS
        const peer = new Peer(undefined, {
            host: "localhost",
            port: 9000, // PeerJS server port
            path: "/peerjs",
        });
        peerInstance.current = peer;

        // Get user media (camera and microphone)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            // Display local video
            localVideoRef.current.srcObject = stream;

            // Listen for incoming calls
            peer.on("call", (call) => {
                call.answer(stream); // Answer the call with the local stream
                call.on("stream", (remoteStream) => {
                    remoteVideoRef.current.srcObject = remoteStream; // Display remote video
                });
            });
        });

        // Generate and set the peer ID
        peer.on("open", (id) => {
            setPeerId(id);
            socket.emit("joinRoom", { room: meetingId, peerId: id });
        });

        // Listen for remote peer ID from the server
        socket.on("userJoined", ({ peerId: remoteId }) => {
            setRemotePeerId(remoteId);
        });

        return () => {
            // Cleanup on component unmount
            peer.disconnect();
            socket.emit("leaveRoom", meetingId);
        };
    }, [meetingId]);

    // Call the remote peer when their ID is received
    useEffect(() => {
        if (remotePeerId && peerInstance.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                const call = peerInstance.current.call(remotePeerId, stream);
                call.on("stream", (remoteStream) => {
                    remoteVideoRef.current.srcObject = remoteStream; // Display remote video
                });
            });
        }
    }, [remotePeerId]);

    return (
        <div className="meeting-room bg-white">
            <h2>Meeting Room: {meetingId}</h2>
            <div className="video-container">
                <video ref={localVideoRef} autoPlay playsInline muted className="local-video" />
                <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            </div>
            <ChatRoom roomName={meetingId} />
        </div>
    );
};

export default MeetingRoom;