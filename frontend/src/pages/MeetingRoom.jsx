import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Peer from "peerjs";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

export default function MeetingRoom(){

  const { id } = useParams();

  const videoGrid = useRef();

  useEffect(()=>{

    const peer = new Peer(undefined,{
      host:"localhost",
      port:9000,
      path:"/peerjs"
    });

    const myVideo = document.createElement("video");
    myVideo.muted = true;

    navigator.mediaDevices.getUserMedia({
      video:true,
      audio:true
    }).then(stream=>{

      addVideoStream(myVideo,stream);

      peer.on("call",call=>{
        call.answer(stream);

        const video = document.createElement("video");

        call.on("stream",userVideoStream=>{
          addVideoStream(video,userVideoStream);
        });
      });

      socket.on("user-connected",(userId)=>{
        connectToNewUser(userId,stream);
      });

    });

    peer.on("open",(userId)=>{
      socket.emit("join-room",id,userId);
    });

    function connectToNewUser(userId,stream){

      const call = peer.call(userId,stream);

      const video = document.createElement("video");

      call.on("stream",(userVideoStream)=>{
        addVideoStream(video,userVideoStream);
      });

    }

    function addVideoStream(video,stream){

      video.srcObject = stream;

      video.addEventListener("loadedmetadata",()=>{
        video.play();
      });

      videoGrid.current.append(video);
    }

  },[]);

  return(

    <div>

      <h2>Meeting Room</h2>

      <div
        ref={videoGrid}
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(3,1fr)",
          gap:"10px"
        }}
      />

    </div>

  )
}