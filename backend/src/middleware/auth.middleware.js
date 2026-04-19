import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect=async (req,res,next)=>
{
    try
    {
        const token=req.cookies.jwt;
        if(!token)
        {
            return res.status(401).json({message:"Unauthorized, no token"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.userId).select("-password");
        if(!user)
        {
            return res.status(401).json({message:"Unauthorized, user not found"});
        }
        req.user=user;
        next();
    }
    catch(error)
    {
        console.log("Error in protect middleware:",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select("-password");
            if (user) {
                req.user = user;
            }
        }
    } catch (error) {
        console.log("Optional auth error:", error.message);
    }
    next();
};