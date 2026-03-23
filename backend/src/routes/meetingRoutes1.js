import express from "express";
import { createMeeting, joinMeeting , getUserMeetings} from "../controllers/meetingController1.js";
import { protect } from "../middleware/auth.middleware.js";

const routerMeeting1 = express.Router();

// ✅ Create Meeting Route
routerMeeting1.post("/create", protect, createMeeting);

// ✅ Join Meeting Route
routerMeeting1.post("/join", protect, joinMeeting);

routerMeeting1.get("/",protect, getUserMeetings);

export default routerMeeting1;