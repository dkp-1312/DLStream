import React, { useState,useEffect } from "react";
import { API } from "../services/api.js";
import ChatRoom from "../components/ChatRoom.jsx";
import {socket} from "../socket.js";

export default function CreateStream() {
  const [title, setTitle] = useState("");
  const [stream, setStream] = useState("lobby");
  const [userCount,setUserCount]=useState(0);

  const create = async () => {
    const res = await API.post("/streams", { title });
    setStream(res.data);
  };

  useEffect(()=>{
    if(!socket.connected)
    {
      socket.connect();
    }
    socket.emit("joinRoom",stream);
    socket.on("userCount",(count)=>{
      setUserCount(count);
    });
    return()=>{
      socket.off("userCount");
    }
  },[stream]);
  

  return (
    <>
    <div className="flex w-full flex-col lg:flex-row">
    <div className="m-10">
      <h2>Create Stream</h2>
      <input
        placeholder="Stream Title"
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered"
      />

      <button onClick={create} className="btn btn-primary mt-4">Create</button>

      {stream && (
        <div>
          <h3>OBS Stream Key:</h3>  
          <code>{stream.streamKey}</code>
          <h3>OBS Watch Script:</h3>
          <code>{stream.watchScript}</code>
          <p>
            RTMP URL: <b>rtmp://localhost/live</b>
          </p>
          
        </div>
      )}
      <p className="mt-4">Connected users:{userCount}</p>
    </div>
    <div className="divider lg:divider-horizontal"></div>
    <ChatRoom roomName={stream.watchScript} />
    </div>
    </>
  );
}
