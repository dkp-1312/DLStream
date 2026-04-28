import express from "express";
import { createMeeting, joinMeeting , getUserMeetings,toggleLiveStatus, cancelMeeting, rescheduleMeeting} from "../controllers/meetingController1.js";
import { protect, optionalAuth } from "../middleware/auth.middleware.js";

const routerMeeting1 = express.Router();

// ✅ Create Meeting Route
routerMeeting1.post("/create", protect, createMeeting);

// ✅ Join Meeting Route
routerMeeting1.post("/join", optionalAuth, joinMeeting);

routerMeeting1.get("/",protect, getUserMeetings);
routerMeeting1.put("/live/:roomName", protect, toggleLiveStatus);
routerMeeting1.put("/cancel/:meetingId", protect, cancelMeeting);
routerMeeting1.put("/reschedule/:meetingId", protect, rescheduleMeeting);

export default routerMeeting1;