import { useState, useEffect} from "react";
import API from "../services/api";
import MeetingRoom from '../components/MeetingRoom';
import WaitingRoom from "../components/WaitingRoom";
import { useParams } from "react-router-dom";

export default function JoinMeeting() {

  const {roomName}= useParams();

  const [token, setToken] = useState(null);
  const [url, setUrl] = useState("");

  // useEffect(()=>{
  //   async function fetchToken(){
  //     const res=await API.post('/meeting1/join',{
  //       roomName,
  //       username:"user_" + Date.now()
  //     });
  //     setToken(res.data.token);
  //     setUrl(res.data.url);
  //   }
  //   fetchToken();
  // },[roomName]);

  const handleJoin = async () => {

    const res =await API.post('/meeting1/join',{
      roomName,
      username:"user_" + Date.now()
    });

    setToken(res.data.token);
    setUrl(res.data.url);
  };

  if(!token)
    return <WaitingRoom onJoin={handleJoin}/>;

  return <MeetingRoom token={token} roomName={roomName} url={url} />;
}