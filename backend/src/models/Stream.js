import mongoose from "mongoose";

const streamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    streamKey: String,
    watchScript: String,
    status: {
      type: String,
      enum: ["Live", "Ended"],
      default: "Live",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Stream", streamSchema);
