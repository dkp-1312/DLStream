import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id).select("-password");
        res.json({success:true,user});
    }
    catch(error)
    {
        res.status(500).json({msg:"Server Error"});
    }
};

import cloudinary from "../lib/cloudinary.js";

export const updateProfile = async (req, res) => {
    try {
        const { fullName, username, bio, phone } = req.body;
        let profilePicUrl = req.body.profilePic;

        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cldRes = await cloudinary.uploader.upload(dataURI, {
                folder: process.env.CLOUDINARY_FOLDER || undefined,
            });
            profilePicUrl = cldRes.secure_url;
        }

        const updateData = { fullName, username, bio, phone };
        if (profilePicUrl) updateData.profilePic = profilePicUrl;

        const user = await User.findByIdAndUpdate(
            req.user._id || req.user.id,
            updateData,
            { new: true }
        ).select("-password");
        
        res.json({ success: true, user });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ msg: "Update Failed", error: error.message });
    }
};

export const changePassword=async(req,res)=>{
    try{
        const {oldPassword,newPassword}=req.body;
        const user=await User.findById(req.user._id);
        const isMatch=await bcrypt.compare(oldPassword,user.password);
        if(!isMatch)
        {
            return res.status(400).json({msg:"Incorrect old Password"});
        }
        user.password=newPassword;
        await user.save();
        res.json({msg:"Password updated successfully"});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({msg:"Password Update Failed"});
    }
}