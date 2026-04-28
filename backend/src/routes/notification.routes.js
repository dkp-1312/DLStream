import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protect, getUserNotifications);
router.put("/:notificationId/read", protect, markNotificationAsRead);
router.put("/read-all", protect, markAllNotificationsAsRead);

export default router;
