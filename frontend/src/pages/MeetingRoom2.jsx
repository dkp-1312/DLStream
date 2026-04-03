import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import API from "../services/api";
import { useEffect, useState, startTransition } from "react";

export default function MeetingRoom2() {
  const [token, setToken] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await API.post("/api/livekit/token", {
        room: "meeting123",
        username: "user1",
      });
      if (!cancelled) startTransition(() => setToken(res.data.token));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
