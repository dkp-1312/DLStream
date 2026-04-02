import {useState} from "react";
import API from "../services/api";
import {useAuthContext} from "../context/AuthContext";

export default function EditProfile() {
    const {authUser,setAuthUser} = useAuthContext();

    const [form,setForm]=useState({
        fullName:authUser.fullName||"",
        username:authUser.username||"",
        bio:authUser.bio,
        phone:authUser.phone||""
    });

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }

    const handleSubmit=async()=>{
        const res=await API.put("/profile/update",form);
        setAuthUser(res.data);
        console.log(res.data);
        alert("Profile Updated!");
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
           
            
            <button onClick={handleSubmit} className="btn btn-primary mt-4">Save</button>
        </div>
    );
}