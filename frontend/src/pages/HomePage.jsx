import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stream"); // "stream" | "meeting"
  const [streamKey, setStreamKey] = useState("");
  const [meetingRoomName, setMeetingRoomName] = useState("");

  const handleWatch = () => {
    const key = streamKey.trim();
    if (key) navigate(`/watch/${encodeURIComponent(key)}`);
  };

  const handleJoinMeeting = () => {
    const room = meetingRoomName.trim();
    if (room) navigate(`/JoinMeeting/${encodeURIComponent(room)}`);
  };

  return (
    <main className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      {/* Background Gradients */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_100%,rgba(16,185,129,0.1),transparent)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-4xl">
        <div className="mx-auto w-full text-center animate-fade-in mb-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-base-content sm:text-5xl lg:text-6xl mb-4">
            Connect & Broadcast{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              seamlessly
            </span>
          </h1>
          <p className="text-lg text-base-content/70">
            One powerful dashboard for all your real-time video needs.
          </p>
        </div>

        <section className="w-full rounded-3xl border border-base-300/60 bg-base-100 shadow-2xl shadow-base-200/50 flex flex-col md:flex-row overflow-hidden animate-fade-in group">
          
          {/* Left Side Presentation */}
          <div className="relative md:w-5/12 bg-gradient-to-br from-base-200/50 to-base-300/30 p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-base-300/50 overflow-hidden">
            {/* Soft decorative blur */}
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-3xl rounded-full scale-150 transform -translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-3 text-base-content">
                {activeTab === "stream" ? "Global Scale" : "Instant Collaboration"}
              </h3>
              <p className="text-base-content/70 leading-relaxed text-sm">
                {activeTab === "stream" 
                  ? "Launch low-latency streams that reach unlimited viewers instantly. Generate a secure key, connect your software, and go live to the world." 
                  : "Spin up secure, high-definition spaces instantly. Hop on a quick sync, share your screen, or host large inclusive team meetings."}
              </p>
            </div>
            
            <div className="relative z-10 mt-10">
              <div className="w-full h-48 bg-gradient-to-tr from-primary/10 via-base-100/40 to-accent/10 rounded-2xl border border-white/10 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden backdrop-blur-md transition-all duration-500 group-hover:shadow-[inset_0_1px_8px_rgba(255,255,255,0.2)]">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
                 
                 <div className="relative w-20 h-20 rounded-full bg-base-100/60 border border-white/20 flex items-center justify-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110">
                     <span className={`text-4xl transition-transform duration-500 ${activeTab === "stream" ? "scale-100" : "scale-0 hidden"}`}>
                        📡
                     </span>
                     <span className={`text-4xl transition-transform duration-500 ${activeTab === "meeting" ? "scale-100" : "scale-0 hidden"}`}>
                        🎥
                     </span>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Side Interactive Form */}
          <div className="md:w-7/12 p-8 sm:p-12 flex flex-col justify-center bg-base-100 relative z-10">
            
            <div className="flex w-full rounded-xl bg-base-200/80 p-1.5 shadow-inner mb-10">
              <button
                type="button"
                className={`flex-1 rounded-lg py-3 text-sm font-bold tracking-wide transition-all duration-300 ${
                  activeTab === "stream"
                    ? "bg-base-100 text-base-content shadow-md scale-[1.02]"
                    : "text-base-content/50 hover:text-base-content hover:bg-base-200/60 scale-100"
                }`}
                onClick={() => setActiveTab("stream")}
              >
                Live Streaming
              </button>
              <button
                type="button"
                className={`flex-1 rounded-lg py-3 text-sm font-bold tracking-wide transition-all duration-300 ${
                  activeTab === "meeting"
                    ? "bg-base-100 text-base-content shadow-md scale-[1.02]"
                    : "text-base-content/50 hover:text-base-content hover:bg-base-200/60 scale-100"
                }`}
                onClick={() => setActiveTab("meeting")}
              >
                Video Meetings
              </button>
            </div>

            <div className="relative min-h-[280px]">
              {/* Stream Panel */}
              <div 
                className={`absolute inset-0 flex flex-col gap-6 transition-all duration-500 ease-in-out ${
                  activeTab === "stream" ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-8 pointer-events-none"
                }`}
              >
                <div className="space-y-4">
                  <button
                    type="button"
                    className="btn btn-primary w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => navigate("/create")}
                  >
                    Start a New Broadcast
                  </button>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-base-content/50">or join stream</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
                </div>

                <div className="space-y-4">
                  <label className="form-control w-full space-y-1.5">
                    <span className="label-text text-sm font-semibold text-base-content/80">Stream Authorization Key</span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Paste key to tune in..."
                        className="input input-bordered w-full h-12 border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all pl-4 text-base"
                        value={streamKey}
                        onChange={(e) => setStreamKey(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </label>

                  <button
                    type="button"
                    className="btn btn-outline w-full h-12 border-base-300 font-bold hover:border-primary hover:bg-primary/5 text-base"
                    onClick={handleWatch}
                  >
                    Watch Live
                  </button>
                </div>
              </div>

              {/* Meeting Panel */}
              <div 
                className={`absolute inset-0 flex flex-col gap-6 transition-all duration-500 ease-in-out ${
                  activeTab === "meeting" ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-8 pointer-events-none"
                }`}
              >
                <div className="space-y-4">
                  <button
                    type="button"
                    className="btn btn-secondary w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => navigate("/createMeeting")}
                  >
                    Create a New Room
                  </button>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-base-content/50">or join room</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-base-content/20 to-transparent" />
                </div>

                <div className="space-y-4">
                  <label className="form-control w-full space-y-1.5">
                    <span className="label-text text-sm font-semibold text-base-content/80">Room Identifier</span>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter room name..."
                        className="input input-bordered w-full h-12 border-base-300 bg-base-100 focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all pl-4 text-base"
                        value={meetingRoomName}
                        onChange={(e) => setMeetingRoomName(e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </label>

                  <button
                    type="button"
                    className="btn btn-outline w-full h-12 border-base-300 font-bold hover:border-secondary hover:text-secondary hover:bg-secondary/5 text-base"
                    onClick={handleJoinMeeting}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
