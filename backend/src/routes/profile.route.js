import express from "express";
import
{
    getProfile,
    updateProfile,
    changePassword
} from "../controllers/profile.controller.js";
import {protect} from "../middleware/auth.middleware.js";

const routerProfile=express.Router();
routerProfile.get("/me",protect,getProfile);
routerProfile.put("/update",protect,updateProfile);
routerProfile.put("/change-password",protect,changePassword);

export default routerProfile;