import User from "../models/User.js"; 
import jwt from "jsonwebtoken";
export const  signup=async (req,res)=>{
    const {fullName,email,password}=req.body;
    try
    {
        if(!email || !password || !fullName)
        {
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6)
        {
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        const existingUser=await User.findOne({email});

        if(existingUser)
        {
            return res.status(400).json({message:"Email already exists,use different one"});
        }
        const idx=Math.floor(Math.random()*100)+1;
        const randomAvatar=`https://avatar.iran.liara.run/public/${idx}.png`; 

        const newUser=await User.create({
            email,
            password,
            fullName,
            profilePic:randomAvatar
        });
        const token=jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, //prevent XSS attacks
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict", //prevent CSRF attacks but allow localhost
            secure:process.env.NODE_ENV==="production" //only send cookie over HTTPS in production
        });
        res.status(201).json({success:true,user:newUser});
    }
    catch(error)
    {
        console.log("Error in signup Controller:",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export const login=async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password) 
        {
            return res.status(400).json({message:"All fields are required"});
        }
        const user=await User.findOne({email}); 

        if(!user)
        {
            return res.status(401).json({message:"Invalid email or password"});
        }
        const isPasswordCorrect=await user.matchPassword(password);
        if(!isPasswordCorrect)
        {
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true, //prevent XSS attacks
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict", //prevent CSRF attacks but allow localhost
            secure:process.env.NODE_ENV==="production" //only send cookie over HTTPS in production
        });
        res.status(200).json({success:true,user});
    }
    catch(error)
    {
        console.log("Error in login Controller:",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout=async (req,res)=>{
    res.clearCookie("jwt");
    res.status(200).json({success:true,message:"Logged out successful"});
}

export const getMe = async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in getMe Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const googleAuth = async (req, res) => {
    try {
        const { email, fullName, profilePic } = req.body;
        if (!email || !fullName) {
            return res.status(400).json({ message: "Email and FullName are required" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // generate random password
            const randomUsername = email.split('@')[0] + Math.floor(Math.random() * 10000);
            
            user = await User.create({
                email,
                fullName,
                password: randomPassword,
                username: randomUsername,
                profilePic: profilePic || `https://avatar.iran.liara.run/public/${Math.floor(Math.random()*100)+1}.png`
            });
        } else {
            // Update profile photo with Google photo if they still have the default one
            if (profilePic && user.profilePic && user.profilePic.includes("avatar.iran.liara.run")) {
                user.profilePic = profilePic;
                await user.save();
            }
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in googleAuth Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};