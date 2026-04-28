import {Link} from "react-router-dom";
import {useAuthContext} from "../context/AuthContext";

export default function Profile() {
    const {authUser} = useAuthContext();
    if(!authUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }
    
    return (
        <div className="min-h-[calc(100vh-3.5rem)] py-10 bg-base-200 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-base-200 to-base-200 bg-fixed flex justify-center">
            <div className="w-full max-w-2xl px-4 mt-4">
                <div className="card bg-base-100/70 backdrop-blur-xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-primary/10">
                    
                    {/* Cover Photo Area */}
                    <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    <div className="px-8 pb-8">
                        {/* Profile Picture overlapping cover */}
                        <div className="relative -mt-16 mb-4 flex justify-between items-end">
                            <div className="avatar">
                                <div className="w-32 h-32 rounded-full ring-4 ring-base-100 bg-base-300 shadow-xl overflow-hidden">
                                    {authUser.profilePic ? (
                                        <img src={authUser.profilePic} alt="Profile" className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl text-base-content/30 font-bold bg-base-200">
                                            {authUser.fullName ? authUser.fullName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Link to="/editProfile" className="btn btn-primary shadow-lg hover:-translate-y-0.5 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                                Edit Profile
                            </Link>
                        </div>

                        {/* User Info Section */}
                        <div className="space-y-6 animate-fade-in-up">
                            <div>
                                <h1 className="text-3xl font-bold text-base-content tracking-tight">{authUser.fullName}</h1>
                                <p className="text-base-content/60 font-medium">@{authUser.username}</p>
                            </div>

                            {authUser.bio && (
                                <div className="bg-base-200/50 p-4 rounded-xl border border-base-300">
                                    <h3 className="text-sm font-bold text-base-content/70 uppercase tracking-wider mb-2">About</h3>
                                    <p className="text-base-content/90 leading-relaxed">{authUser.bio}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                        </svg>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-semibold text-base-content/50 uppercase">Email Address</p>
                                        <p className="font-medium text-base-content truncate">{authUser.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 bg-base-100 p-4 rounded-xl border border-base-300 shadow-sm">
                                    <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                        </svg>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-semibold text-base-content/50 uppercase">Phone Number</p>
                                        <p className="font-medium text-base-content truncate">{authUser.phone || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-base-300 flex justify-end">
                                <Link to="/settings" className="btn btn-ghost hover:bg-base-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Account Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}