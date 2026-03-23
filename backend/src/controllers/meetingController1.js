import Meeting from "../models/Meeting.js";
import { v4 as uuidv4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";

// ENV VALUES
const API_KEY = "APIKEY123";
const API_SECRET = "2ab2b5797939d07a6b815e0e4f38ca69f7f51e5a237b347e13c5228144a87fd7";
const LIVEKIT_URL = "ws://20.2.137.241:7880";

// ✅ Create Meeting
export const createMeeting = async (req, res) => {
  try {
    const { meetingName,meetingDate,invitations } = req.body;
    const roomName = `room-${uuidv4()}`;

    const meetingLink=`http://localhost:5173/JoinMeeting/${roomName}`;
    const meeting = await Meeting.create({
      meetingName,
      meetingDate,
      ownerId: req.user._id || "demoUser",
      roomName,
      meetingLink,
      invitations: invitations.map(email => ({ email }))
    });
    res.status(201).json(meeting);
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Join Meeting (Generate Token)
export const joinMeeting = async (req, res) => {
  try {
    const { roomName, username } = req.body;

    if(!roomName || !username) 
    {
      return res.status(400).json({ error: "roomName and username are required" });
    }

    const at = new AccessToken(API_KEY, API_SECRET, {
      identity: username,
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    res.json({
      token,
      url: LIVEKIT_URL,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getUserMeetings = async (req, res) => {
  try {

    const email = req.user.email;

    const meetings = await Meeting.find({
      $or: [
        { ownerId: req.user._id },
        { "invitations.email": email }
      ]
    });

    const updatedMeetings = meetings.map(meeting => {

      const obj = meeting.toObject();

      const isOwner = meeting.ownerId.toString() === req.user._id.toString();

      obj.isOwner = isOwner;

      if (!isOwner) {
        const invite = meeting.invitations.find(
          inv => inv.email === email
        );

        obj.status = invite ? invite.status : "pending";
      }

      return obj;
    });

    res.status(200).json(updatedMeetings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};