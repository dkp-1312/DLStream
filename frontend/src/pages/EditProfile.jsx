import {useState} from "react";
import API from "../services/api";
import {useAuthContext} from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function EditProfile() {
    const {authUser,setAuthUser} = useAuthContext();
    const navigate = useNavigate();

    const [form,setForm]=useState({
        fullName:authUser.fullName||"",
        username:authUser.username||"",
        bio:authUser.bio,
        phone:authUser.phone||"",
        profilePic:authUser.profilePic||""
    });

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }

    const handleSubmit=async()=>{
        const res=await API.put("/profile/update",form);
        if(res.data.success) {
            setAuthUser(res.data.user);
            localStorage.setItem("authUser", JSON.stringify(res.data.user));
            toast.success("Profile Updated!");
            navigate("/profile");
        }
    };
    return (
        <div className="p-6">
            <h1>Edit Profile</h1>
            <label className="input input-bordered flex items-center gap-2 w-1/2">Name
            <input name="fullName" className="grow" value={form.fullName} onChange={handleChange}/>
            </label>
            <label className="input input-bordered flex items-center gap-2 w-1/2">UserName
            <input name="username" className="grow" value={form.username} onChange={handleChange}/>
            </label>
            <label className="input input-bordered flex items-center gap-2 w-1/2">Phone
            <input name="phone" className="grow" value={form.phone} onChange={handleChange}/>
            </label>

            <textarea name="bio" className="textarea textarea-bordered flex items-center gap-2 w-1/2" value={form.bio} onChange={handleChange} placeholder="Bio"/>
            
            <label className="input input-bordered flex items-center gap-2 w-1/2 mt-3">Profile Photo URL
            <input name="profilePic" className="grow" value={form.profilePic} onChange={handleChange} placeholder="https://..."/>
            </label>
            <button onClick={handleSubmit} className="btn btn-primary mt-4">Save</button>
        </div>
    );
}