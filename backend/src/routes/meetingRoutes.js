import express from "express";
import { createMeeting,getUserMeetings,getMeetingDetails,updateInvitationStatus } from "../controllers/meetingController.js";
import { protect } from "../middleware/auth.middleware.js";

const meetingRouter=express.Router();

meetingRouter.post("/",protect,createMeeting);
meetingRouter.get("/",protect,getUserMeetings);
meetingRouter.get("/:meetingId",protect,getMeetingDetails);
meetingRouter.put("/:meetingId/respond",protect,updateInvitationStatus);

export default meetingRouter;