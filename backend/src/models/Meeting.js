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
        invitations:[invitationSchema]
    },
    {timestamps:true}
);

export default mongoose.model("Meeting",meetingSchema);
