import {useState} from "react";
import API from "../services/api";
import {useAuthContext} from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
    const {authUser,setAuthUser} = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [form,setForm]=useState({
        fullName:authUser.fullName||"",
        username:authUser.username||"",
        bio:authUser.bio||"",
        phone:authUser.phone||""
    });
    const [file, setFile] = useState(null);

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value});
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            if (selected.size > 3 * 1024 * 1024) {
                toast.error("Profile photo must be less than 3MB");
                e.target.value = null; // reset
                return;
            }
            setFile(selected);
        }
    };

    const handleSubmit=async()=>{
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", form.fullName);
            formData.append("username", form.username);
            formData.append("bio", form.bio);
            formData.append("phone", form.phone);
            if (file) {
                formData.append("profilePic", file);
            }

            const res = await API.put("/profile/update", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(res.data.success) {
                setAuthUser(res.data.user);
                localStorage.setItem("authUser", JSON.stringify(res.data.user));
                toast.success("Profile Updated!");
                navigate("/profile");
            }
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-3.5rem)] py-10 bg-base-200 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-secondary/10 via-base-200 to-base-200 bg-fixed flex justify-center">
            <div className="w-full max-w-2xl px-4 mt-4">
                <div className="card bg-base-100/70 backdrop-blur-xl shadow-2xl border border-white/10 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                    
                    <div className="card-body p-8 sm:p-10 gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-base-content">
                                Edit Profile
                            </h1>
                            <p className="text-sm text-base-content/60 mt-1">
                                Make changes to your public profile and personal information.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 mt-4">
                            {/* Avatar File Input Section */}
                            <div className="flex-shrink-0 flex flex-col items-center gap-4">
                                <div className="avatar">
                                    <div className="w-32 h-32 rounded-full ring-4 ring-base-200 bg-base-300 shadow-xl overflow-hidden relative group">
                                        {file ? (
                                            <img src={URL.createObjectURL(file)} alt="Preview" className="object-cover" />
                                        ) : authUser.profilePic ? (
                                            <img src={authUser.profilePic} alt="Profile" className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-base-200 text-base-content/30">
                                                {authUser.fullName ? authUser.fullName.charAt(0).toUpperCase() : '?'}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <label htmlFor="photo-upload" className="cursor-pointer text-white/90 text-xs font-semibold flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mb-1">
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                                </svg>
                                                Upload Image
                                            </label>
                                            <input 
                                                id="photo-upload"
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleFileChange} 
                                                className="hidden"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-base-content/50 font-medium">Max 3MB, JPG/PNG</p>
                                </div>
                            </div>
                            
                            {/* Form Fields Section */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-semibold text-base-content/80">Full Name</span>
                                        </label>
                                        <input 
                                            name="fullName" 
                                            className="input input-bordered w-full bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200" 
                                            value={form.fullName} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text font-semibold text-base-content/80">Username</span>
                                        </label>
                                        <input 
                                            name="username" 
                                            className="input input-bordered w-full bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200" 
                                            value={form.username} 
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold text-base-content/80">Phone Number</span>
                                    </label>
                                    <input 
                                        name="phone" 
                                        className="input input-bordered w-full bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200" 
                                        value={form.phone} 
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text font-semibold text-base-content/80">Bio</span>
                                    </label>
                                    <textarea 
                                        name="bio" 
                                        className="textarea textarea-bordered h-24 w-full bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none" 
                                        value={form.bio} 
                                        onChange={handleChange} 
                                        placeholder="Tell us a bit about yourself..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-base-300">
                            <button 
                                onClick={() => navigate("/profile")} 
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit} 
                                disabled={loading} 
                                className={`btn btn-primary px-8 shadow-lg hover:shadow-primary/40 transition-all duration-300 ${loading ? 'loading' : ''}`}
                            >
                                {loading ? <span className="loading loading-spinner text-base-100"></span> : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}