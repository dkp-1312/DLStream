import { useState } from "react";
import API from "../services/api";
import MeetingRoom from '../components/MeetingRoom';
import WaitingRoom from "../components/WaitingRoom";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";
export default function JoinMeeting() {
  const { roomName } = useParams();
  const { authUser } = useAuthContext();

  const [token, setToken] = useState(null);
  const [url, setUrl] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [isOwner, setIsOwner] = useState(false); // 🔥 Track if user is the actual owner
  const [isLive, setIsLive] = useState(false);   // 🔥 Track room state
  const [streamKey, setStreamKey] = useState("");
  const [watchScript, setWatchScript] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleJoin = async () => {
    try {
      const res = await API.post('/meeting1/join', {
        roomName,
        username: authUser ? authUser.fullName : "Guest" 
      });

      setToken(res.data.token);
      setUrl(res.data.url);
      setIsHost(res.data.isHost); 
      setIsOwner(res.data.isOwner); 
      setIsLive(res.data.isLive);
      setStreamKey(res.data.streamKey);
      setWatchScript(res.data.watchScript);
      setIsConnected(true);
    } catch (error) {
      // 🔥 Show the specific error if the meeting isn't live yet
      if (error.response && error.response.status === 403) {
        toast.error(error.response.data.error); 
      } else {
        toast.error("Failed to join meeting.");
      }
    }
  };

  const handleDisconnect = () => {
    setToken(null);
    setIsConnected(false);
  }

  if(!isConnected)
    return <WaitingRoom onJoin={handleJoin}/>;

  return (
    <MeetingRoom 
      token={token} 
      roomName={roomName} 
      url={url} 
      isHost={isHost} 
      isOwner={isOwner} 
      initialIsLive={isLive}
      streamKey={streamKey}
      watchScript={watchScript}
      onDisconnect={handleDisconnect} 
    />
  );
}