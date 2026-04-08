import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
export default function CreateMeeting() {

  const [meetingName, setMeetingName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [emails, setEmails] = useState("");

  const submit = async () => {
    const invitations = emails.split(",");

    const res=await API.post("/meeting1/create", {
      meetingName,
      meetingDate,
      invitations
    });
    console.log("Meeting Created:", res);
    toast.success("Meeting Created");
    console.log("Join Link:", res.data.meetingLink);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">

      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-4">

          <h2 className="card-title justify-center text-2xl">
            Create Meeting
          </h2>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Meeting Name:</span>
            </label>
            <input
              type="text"
              placeholder="Enter meeting name"
              className="input input-bordered w-full"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Meeting Date:</span>
            </label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Invite Emails<small>(separated by coma)</small>:</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary w-full mt-2"
            onClick={submit}
          >
            Create Meeting
          </button>

        </div>
      </div>

    </div>
  );
}