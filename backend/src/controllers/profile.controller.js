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

export const updateProfile=async(req,res)=>{
    try{
        const {fullName,username,bio,phone}=req.body;
        console
        const user=await User.findByIdAndUpdate(
            req.user.id,
            {fullName,username,bio,phone},
            {new:true}
        ).select("-password");
        res.json({success:true,user});
    }
    catch(error)
    {
        res.status(500).json({msg:"Update Failed"});
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