import {useState} from "react";
import API from "../services/api";
import {useAuthContext} from "../context/AuthContext";
import { toast } from "react-hot-toast";
export default function Settings(){
    const [data,setData]=useState({
        oldPassword:"",
        newPassword:""
    });
    const {handleLogout}=useAuthContext();
    const handleChange=(e)=>{
        setData({...data,[e.target.name]:e.target.value});
    }

    const handleSubmit=async()=>{
        try{
            await API.put("/profile/change-password",data);
            toast.success("Password changed successfully. Please login again.");
            handleLogout();
        }
        catch {
            toast.error("Error changing password. Please try again.");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl p-4">
            <h1 className="m-4 justify-center card-title">Change Password</h1>
            <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                className="input input-bordered w-full max-w-xs m-3"
                onChange={handleChange}
                />
            <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="input input-bordered w-full max-w-xs m-3"
                onChange={handleChange}
                />
            <button onClick={handleSubmit} className="btn btn-primary mt-4">Change Password</button>
        </div>
        </div>
    );
}