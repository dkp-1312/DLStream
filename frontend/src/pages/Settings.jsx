import {useState} from "react";
import API from "../services/api";
import {useAuthContext} from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Settings() {
    const [data,setData]=useState({
        oldPassword:"",
        newPassword:""
    });
    const [loading, setLoading] = useState(false);
    const {handleLogout}=useAuthContext();

    const handleChange=(e)=>{
        setData({...data,[e.target.name]:e.target.value});
    }

    const handleSubmit=async()=>{
        if(!data.oldPassword || !data.newPassword) {
            return toast.error("Please fill in both fields");
        }
        setLoading(true);
        try{
            await API.put("/profile/change-password",data);
            toast.success("Password changed successfully. Please login again.");
            handleLogout();
        }
        catch (error) {
            toast.error(error?.response?.data?.msg || "Error changing password. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] py-10 bg-base-200 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-base-200 to-base-200 bg-fixed flex justify-center items-start">
            <div className="w-full max-w-lg px-4 mt-8">
                <div className="card bg-base-100/70 backdrop-blur-xl shadow-2xl border border-white/10 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-accent via-secondary to-primary"></div>
                    <div className="card-body p-8 sm:p-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-base-content">Security Settings</h1>
                                <p className="text-sm text-base-content/60 mt-1">Update your password securely.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="form-control w-full relative">
                                <label className="label">
                                    <span className="label-text font-semibold text-base-content/80">Current Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    placeholder="••••••••"
                                    className="input input-bordered w-full bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-control w-full relative">
                                <label className="label">
                                    <span className="label-text font-semibold text-base-content/80">New Password</span>
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    placeholder="••••••••"
                                    className="input input-bordered w-full bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                    onChange={handleChange}
                                />
                                <label className="label">
                                    <span className="label-text-alt text-base-content/50">Must be at least 6 characters.</span>
                                </label>
                            </div>

                            <button 
                                onClick={handleSubmit} 
                                disabled={loading}
                                className={`btn btn-primary w-full mt-4 shadow-lg hover:shadow-primary/40 transition-all duration-300 ${loading ? 'loading' : ''}`}
                            >
                                {loading ? <span className="loading loading-spinner text-base-100"></span> : "Update Password"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}