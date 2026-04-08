import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { signup, login, logout, getMe, googleAuth } from '../controllers/auth.controller.js';
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.post("/google", googleAuth);

export default router;