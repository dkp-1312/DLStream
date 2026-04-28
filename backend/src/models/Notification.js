import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        type: {
            type: String,
            enum: ["INVITE", "ACCEPT", "DECLINE", "ALERT"],
            required: true
        },
        meetingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Meeting",
            required: true
        },
        message: {
            type: String,
            required: true
        },
        link: {
            type: String, 
        },
        isRead: {
            type: Boolean,
            default: false
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Notification", notificationSchema);
