
import { useState } from "react";
import API from "../services/api";

export default function CreateMeeting1() {

  const [meeting, setMeeting] = useState(null);

  const create = async () => {

    const res = await API.post(
      "/meeting1/create",
      { meetingName: "Test Meeting" }
    );

    setMeeting(res.data);
  };

  return (
    <div>
      <button onClick={create}>Create Meeting</button>

      {meeting && (
        <div>
          <p>Room: {meeting.roomName}</p>
        </div>
      )}
    </div>
  );
}