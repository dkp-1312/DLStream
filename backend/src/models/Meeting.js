import mongoose from "mongoose";

const invitationSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted","declined"],
        default:"pending"
    }
});

const meetingSchema= new mongoose.Schema(
    {
        meetingName:{type:String,required:true},
        ownerId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        meetingDate:{
            type:Date,
            required:true
        },
        roomName:{type:String,required:true},
        meetingLink:{type:String,required:true},
        invitations:[invitationSchema],
        isLive: { type: Boolean, default: false },
        streamKey: { type: String },
        watchScript: { type: String }
    },
    {timestamps:true}
);

export default mongoose.model("Meeting",meetingSchema);