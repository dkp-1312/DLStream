import express from "express";
import
{
    getProfile,
    updateProfile,
    changePassword
} from "../controllers/profile.controller.js";
import {protect} from "../middleware/auth.middleware.js";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ 
    storage, 
    limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

const routerProfile=express.Router();
routerProfile.get("/me",protect,getProfile);
routerProfile.put("/update",protect,upload.single("profilePic"),updateProfile);
routerProfile.put("/change-password",protect,changePassword);

export default routerProfile;