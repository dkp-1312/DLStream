import {
    LiveKitRoom,
    VideoConference
  } from "@livekit/components-react";
import API from "../services/api";
import { useEffect } from "react";
  
export default function MeetingRoom({ token }) {

    const [ token, setToken ] = useState("");
    const joinMeeting = async () => {

        const res = await API.post(
        "/api/livekit/token",
        {
            room:"meeting123",
            username:"user1"
        }
        );
   
        setToken(res.data.token);
   };
   useEffect(() => {joinMeeting();}, []);
    return (
  
      <LiveKitRoom
        video
        audio
        token={token}
        serverUrl="ws://20.2.137.241:7880"
        connect={true}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
  
        <VideoConference />
  
      </LiveKitRoom>
  
    );
  
  }