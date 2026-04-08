import Meeting from "../models/Meeting.js";
import { v4 as uuidv4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";


// const LIVEKIT_URL = "wss://dlstream-api.eastasia.cloudapp.azure.com";

// ✅ Create Meeting
export const createMeeting = async (req, res) => {
  try {
    const { meetingName, meetingDate, invitations } = req.body;
    const roomName = `room-${uuidv4()}`;

    const meetingLink = `http://localhost:5173/JoinMeeting/${roomName}`;
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

    const meeting = await Meeting.findOne({ roomName });
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Determine Roles
    const isOwner = meeting.ownerId.toString() === req.user._id.toString();
    const isInvited = meeting.invitations.some(inv => inv.email === req.user.email);
    const isHost = isOwner || isInvited;

    // 🔥 GATEKEEPER: Block Viewers if the meeting is not Live yet
    if (!meeting.isLive && !isHost) {
      return res.status(403).json({
        error: "Meeting has not started yet. Please wait for the host to go live."
      });
    }

    // Generate Token
    const uniqueIdentity = `${req.user._id}_${Date.now()}`;
    const displayName = req.user.fullName || username;

    const at = new AccessToken(process.env.API_KEY1, process.env.API_SECRET1, {
      identity: uniqueIdentity,
      name: displayName,
      metadata: JSON.stringify({ profilePic: req.user.profilePic || "" })
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isHost,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    // 🔥 Send isOwner and isLive state to frontend
    res.json({ token, url: process.env.LIVEKIT_URL1, isHost, isOwner, isLive: meeting.isLive });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔥 NEW CONTROLLER: Toggle Live Status
export const toggleLiveStatus = async (req, res) => {
  try {
    const { roomName } = req.params;
    const meeting = await Meeting.findOne({ roomName });

    if (!meeting) return res.status(404).json({ error: "Meeting not found" });

    // Only the actual Owner can start/stop the broadcast
    if (meeting.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Only the meeting owner can go live." });
    }

    meeting.isLive = !meeting.isLive;
    await meeting.save();

    res.json({ success: true, isLive: meeting.isLive });
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