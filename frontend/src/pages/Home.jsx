import React, { useEffect, useState } from "react";
import { API } from "../services/api.js";
import { Link } from "react-router-dom";
import { MeetingCardSkeleton } from "../components/Skeleton";

export default function Home() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/streams")
      .then((res) => {
        setStreams(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] py-12 bg-base-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-base-200 to-base-200 bg-fixed">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-primary-content shadow-2xl mb-12">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Experience Live Like Never Before.
            </h1>
            <p className="mt-6 text-lg font-medium opacity-90 leading-relaxed">
              DLStream brings you high-fidelity meetings and real-time streaming with zero friction. Join the conversation today.
            </p>
            <div className="mt-10 flex gap-4">
              <Link to="/meetings" className="btn btn-neutral btn-lg px-8 shadow-lg">View Schedule</Link>
              <Link to="/createMeeting" className="btn btn-ghost btn-lg border-white/20 hover:bg-white/10">Create Room</Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-20 transform rotate-12 pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.7,87.1,0C87.1,15.7,83.7,31.3,76.4,44.7C69.2,58.1,58.1,69.2,44.7,76.4C31.3,83.7,15.7,87.1,0,87.1C-15.7,87.1,-31.3,83.7,-44.7,76.4C-58.1,69.2,-69.2,58.1,-76.4,44.7C-83.7,31.3,-87.1,15.7,-87.1,0C-87.1,-15.7,-83.7,-31.3,-76.4,-44.7C-69.2,-58.1,-58.1,-69.2,-44.7,-76.4C-31.3,-83.7,-15.7,-87.1,0,-87.1C15.7,-87.1,31.3,-83.7,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error font-bold"></span>
            </span>
            Active Broadcasts
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <MeetingCardSkeleton key={i} />)}
          </div>
        ) : streams.length === 0 ? (
          <div className="card bg-base-100/60 backdrop-blur-xl border border-dashed border-base-300 py-24 text-center shadow-xl">
             <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4 text-base-content/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
             </div>
             <h3 className="text-xl font-bold opacity-70">No streams live right now</h3>
             <p className="text-sm opacity-50 mt-2">Come back later or start your own meeting!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((s) => (
              <div key={s._id} className="group card bg-base-100/70 backdrop-blur-md shadow-xl border border-white/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <div className="card-body p-6 gap-4">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title text-xl font-bold group-hover:text-primary transition-colors">{s.title}</h3>
                    <div className="badge badge-error badge-sm animate-pulse font-bold">LIVE</div>
                  </div>
                  <p className="text-sm opacity-60 line-clamp-2">Join this live session to interact and watch real-time streaming.</p>
                  <div className="card-actions justify-end mt-4">
                    <Link to={`/watch/${s.streamKey}`} className="btn btn-primary btn-sm rounded-lg shadow-lg shadow-primary/30">Watch Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
