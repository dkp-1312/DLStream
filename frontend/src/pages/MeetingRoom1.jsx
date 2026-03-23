import {
    LiveKitRoom,
    VideoConference
  } from "@livekit/components-react";
  
  export default function MeetingRoom1({ token, url }) {
  
    return (
      <LiveKitRoom
        token={token}
        serverUrl={url}
        connect={true}
        video={true}
        audio={true}
        style={{ height: "100vh" }}
      >
        <VideoConference />
      </LiveKitRoom>
    );
  }