import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  meetingName: String,
  roomName: String,
  ownerId: String,
  participants: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Meeting1",meetingSchema);