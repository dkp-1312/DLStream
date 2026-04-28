import Meeting from "../models/Meeting.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";
import crypto from "crypto";
import { emitToUser } from "../lib/socketStore.js";
import { sendMeetingInviteEmail } from "../lib/emailService.js";
// const LIVEKIT_URL = "wss://dlstream-api.eastasia.cloudapp.azure.com";

// ✅ Create Meeting
export const createMeeting = async (req, res) => {
  try {
    const { meetingName, meetingDate, invitations } = req.body;
    const roomName = `room-${uuidv4()}`;
    const streamKey = crypto.randomBytes(8).toString("hex");
    const watchScript = crypto.randomBytes(8).toString("hex");

    const meetingLink = `${process.env.frontend_url || "http://localhost:5173"}/JoinMeeting/${roomName}`;
    const cleanInvitations = invitations.map(email => email.trim());
    
    const owner = await User.findById(req.user._id);

    const meeting = await Meeting.create({
      meetingName,
      meetingDate,
      ownerId: req.user._id || "demoUser",
      roomName,
      meetingLink,
      streamKey,
      watchScript,
      invitations: cleanInvitations.map(email => ({ email }))
    });

    // Create notifications for invited users
    const invitedUsers = await User.find({ email: { $in: cleanInvitations } });
    
    // Set expiration to the meeting date or 1 week from now, whichever is later
    const expirationDate = new Date(meetingDate) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
      ? new Date(meetingDate) 
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const notifications = invitedUsers.map(user => ({
      recipient: user._id,
      sender: req.user._id,
      type: "INVITE",
      meetingId: meeting._id,
      message: `You've been invited to meeting: ${meetingName}`,
      link: `/JoinMeeting/${roomName}`,
      expiresAt: expirationDate
    }));

    if (notifications.length > 0) {
      const inserted = await Notification.insertMany(notifications);
      
      // Notify online users instantly via Socket.io helper
      inserted.forEach(notif => {
        emitToUser(notif.recipient.toString(), "newNotification", notif);
      });
    }

    // Send emails
    const ownerName = owner ? owner.fullName : "A user";
    cleanInvitations.forEach(email => {
      sendMeetingInviteEmail(email, meetingName, meetingDate, meetingLink, ownerName);
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
    const isOwner = !!(req.user && meeting.ownerId.toString() === req.user._id.toString());
    const isInvited = !!(req.user && meeting.invitations.some(inv => inv.email === req.user.email));
    const isHost = isOwner || isInvited;

    // 🔥 GATEKEEPER: Block Viewers if the meeting is not Live yet
    if (!meeting.isLive && !isHost) {
      return res.status(403).json({
        error: "Meeting has not started yet. Please wait for the host to go live."
      });
    }

    // Generate Token
    const uniqueIdentity = req.user ? `${req.user._id}_${Date.now()}` : `guest_${Date.now()}`;
    const displayName = req.user ? req.user.fullName : (username || "Guest");
    const profilePic = req.user ? (req.user.profilePic || "") : "";

    const at = new AccessToken(process.env.API_KEY1, process.env.API_SECRET1, {
      identity: uniqueIdentity,
      name: displayName,
      metadata: JSON.stringify({ profilePic })
    });

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: isHost,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    // 🔥 Send isOwner and isLive state to frontend
    res.json({ token, url: process.env.LIVEKIT_URL1, isHost, isOwner, isLive: meeting.isLive, streamKey: isOwner ? meeting.streamKey : undefined, watchScript: meeting.watchScript });
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

        if (obj.status !== "cancelled") {
          obj.status = invite ? invite.status : "pending";
        }
      }

      return obj;
    });

    res.status(200).json(updatedMeetings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findById(meetingId);
    
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });
    if (meeting.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    meeting.status = "cancelled";
    await meeting.save();

    // Notify all participants
    const participantEmails = meeting.invitations.map(inv => inv.email);
    const users = await User.find({ email: { $in: participantEmails } });
    
    const notifications = users.map(user => ({
      recipient: user._id,
      sender: req.user._id,
      type: "ALERT",
      meetingId: meeting._id,
      message: `Meeting cancelled: ${meeting.meetingName}`,
      link: `/meetings`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }));

    if (notifications.length > 0) {
      const inserted = await Notification.insertMany(notifications);
      inserted.forEach(notif => {
        emitToUser(notif.recipient.toString(), "newNotification", notif);
      });
    }

    res.json({ success: true, message: "Meeting cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rescheduleMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { newDate } = req.body;
    
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ error: "Meeting not found" });
    if (meeting.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    meeting.meetingDate = newDate;
    await meeting.save();

    // Notify participants
    const participantEmails = meeting.invitations.map(inv => inv.email);
    const users = await User.find({ email: { $in: participantEmails } });

    const notifications = users.map(user => ({
      recipient: user._id,
      sender: req.user._id,
      type: "ALERT",
      meetingId: meeting._id,
      message: `Meeting rescheduled for ${new Date(newDate).toLocaleString()}: ${meeting.meetingName}`,
      link: `/meetings`,
      expiresAt: new Date(newDate)
    }));

    if (notifications.length > 0) {
      const inserted = await Notification.insertMany(notifications);
      inserted.forEach(notif => {
        emitToUser(notif.recipient.toString(), "newNotification", notif);
      });
    }

    res.json({ success: true, message: "Meeting rescheduled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMeetingByStreamKey = async (streamKey) => {
  return await Meeting.findOne({ streamKey });
};