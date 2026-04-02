import {
  useLocalParticipant,
  useRoomContext
} from "@livekit/components-react";

export default function Controls({ onDisconnect }) {
  // 1. Extract the reactive state variables directly from the hook
  const { 
      localParticipant, 
      isMicrophoneEnabled, 
      isCameraEnabled, 
      isScreenShareEnabled 
  } = useLocalParticipant();
  
  const room = useRoomContext();

  // 2. Use async/await and check if localParticipant exists before toggling
  const toggleMic = async () => {
      if (localParticipant) {
          await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
      }
  };

  const toggleCam = async () => {
      if (localParticipant) {
          await localParticipant.setCameraEnabled(!isCameraEnabled);
      }
  };

  const shareScreen = async () => {
      if (localParticipant) {
          await localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
      }
  };

  const endCall = () => {
      room.disconnect();
      if (onDisconnect) { onDisconnect(); }
  };

  return (
      // Added z-50 to ensure it always stays above the video grid
      <div className="fixed bottom-0 w-full flex justify-center gap-4 p-4 bg-base-200 z-50 shadow-lg">
          
          <button 
              className={`btn ${isMicrophoneEnabled ? 'btn-success' : 'btn-error'}`} 
              onClick={toggleMic}
          >
              {isMicrophoneEnabled ? " Mic On" : " Mic Off"}
          </button>

          <button 
              className={`btn ${isCameraEnabled ? 'btn-success' : 'btn-error'}`} 
              onClick={toggleCam}
          >
              {isCameraEnabled ? " Cam On" : " Cam Off"}
          </button>

          <button 
              className={`btn ${isScreenShareEnabled ? 'btn-warning' : 'btn-info'}`} 
              onClick={shareScreen}
          >
              {isScreenShareEnabled ? "Stop Share" : " Screen Share"}
          </button>

          <button className="btn btn-error outline outline-2 outline-offset-2" onClick={endCall}>
              End Meeting
          </button>

      </div>
  );
}