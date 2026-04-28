import Meeting from "../models/Meeting.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../lib/socketStore.js";
export const createMeeting=async(req,res)=>{
    try {
        const {meetingName,meetingDate,invitations}=req.body;
        const meeting=await Meeting.create({
            meetingName,
            ownerId:req.user._id,
            meetingDate,
            invitations:invitations.map(email=>({email}))
        });
        res.status(201).json({success:true,meeting});
    } catch (error) {
        res.status(500).json({error:error.message});   
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

export const getMeetingDetails=async(req,res)=>{
    const meeting=await Meeting.findById(req.params.meetingId);
    if(!meeting)
    {
        return res.status(404).json({message:"Meeting not found"});
    }
    if(meeting.ownerId.toString()!==req.user._id.toString())
    {
        return res.status(403).json({message:"Access denied"});
    }
    console.log(meeting);
    res.status(200).json(meeting);
}

export const updateInvitationStatus=async(req,res)=>{
    try {
        const {meetingId}=req.params;
        const {status}=req.body;
        const meeting=await Meeting.findById(meetingId);
        const invite=meeting.invitations.find(
            inv=>inv.email===req.user.email
        );
        if(!invite)
        {
            return res.status(404).json({message:"Invitation not found"});
        }
        invite.status=status;
        await meeting.save();

        // Create notification for the owner
        const expirationDate = new Date(meeting.meetingDate) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
            ? new Date(meeting.meetingDate) 
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const notif = await Notification.create({
            recipient: meeting.ownerId,
            sender: req.user._id,
            type: status.toUpperCase(), 
            meetingId: meeting._id,
            message: `${req.user.fullName || req.user.email} has ${status} your meeting: ${meeting.meetingName}`,
            link: `/MeetingDetails/${meeting._id}`,
            expiresAt: expirationDate
        });

        emitToUser(meeting.ownerId.toString(), "newNotification", notif);

        res.status(200).json({success:true,message:"Invitation status updated"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}