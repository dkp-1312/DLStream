import {
    useLocalParticipant,
    useRoomContext
} from "@livekit/components-react";
  
export default function Controls({onDisconnect}) {
  
    const { localParticipant } = useLocalParticipant();
    const room = useRoomContext();
  
    const toggleMic = () => {
      localParticipant.setMicrophoneEnabled(
        !localParticipant.isMicrophoneEnabled
      );
    };
  
    const toggleCam = () => {
      localParticipant.setCameraEnabled(
        !localParticipant.isCameraEnabled
      );
    };
  
    const shareScreen = async () => {
      await localParticipant.setScreenShareEnabled(true);
    };
  
    const startRecording = () => {
      alert("Recording started (connect backend later)");
    };
    const endCall=()=>{
      room.disconnect();
      if(onDisconnect) {onDisconnect();}
    }
  
    return (
      <div className="fixed bottom-0 w-full flex justify-center gap-4 p-4 bg-base-200">
  
        <button className="btn btn-error" onClick={toggleMic}>
          Mic
        </button>
  
        <button className="btn btn-warning" onClick={toggleCam}>
          Camera
        </button>
  
        <button className="btn btn-info" onClick={shareScreen}>
          Screen Share
        </button>
  
        {/* <button className="btn btn-success" onClick={startRecording}>
          Record
        </button> */}
        <button className="btn btn-info" onClick={endCall}>
          End Meeting
        </button>
  
      </div>
    );
  }