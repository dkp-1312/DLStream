import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
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
    <main className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(2,132,199,0.15),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(13,148,136,0.08),transparent_50%)]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Meetings &amp; live streaming
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-base-content sm:text-4xl lg:text-5xl">
            Run calls and broadcasts from{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              one place
            </span>
          </h1>
          <p className="mt-4 text-base text-base-content/70 sm:text-lg">
            Create a stream, share a key, or host a meeting room. Built for clarity and speed.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2 lg:gap-8">
          <section className="card border border-base-300/80 bg-base-100 shadow-soft animate-fade-in">
            <div className="card-body gap-5 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg">
                  📡
                </span>
                <div>
                  <h2 className="card-title text-xl font-bold">Live streaming</h2>
                  <p className="text-sm text-base-content/65">
                    Start a broadcast or watch with a stream key.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary w-full font-semibold shadow-sm"
                onClick={() => navigate("/create")}
              >
                Create stream
              </button>

              <div className="divider my-0 text-xs font-medium text-base-content/50">
                or join with a key
              </div>

              <label className="form-control w-full">
                <span className="label-text font-medium">Stream key</span>
                <input
                  type="text"
                  placeholder="Paste or type stream key"
                  className="input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={streamKey}
                  onChange={(e) => setStreamKey(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <button
                type="button"
                className="btn btn-outline w-full border-base-300 font-semibold hover:border-primary hover:bg-primary/5"
                onClick={handleWatch}
              >
                Watch stream
              </button>
            </div>
          </section>

          <section className="card border border-base-300/80 bg-base-100 shadow-soft animate-fade-in [animation-delay:80ms]">
            <div className="card-body gap-5 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-lg">
                  🎥
                </span>
                <div>
                  <h2 className="card-title text-xl font-bold">Video meetings</h2>
                  <p className="text-sm text-base-content/65">
                    Schedule or join a room by name.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary w-full font-semibold shadow-sm"
                onClick={() => navigate("/createMeeting")}
              >
                Create meeting
              </button>

              <div className="divider my-0 text-xs font-medium text-base-content/50">
                or join a room
              </div>

              <label className="form-control w-full">
                <span className="label-text font-medium">Room name</span>
                <input
                  type="text"
                  placeholder="Enter meeting room name"
                  className="input input-bordered w-full border-base-300 bg-base-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={meetingRoomName}
                  onChange={(e) => setMeetingRoomName(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <button
                type="button"
                className="btn btn-outline w-full border-base-300 font-semibold hover:border-primary hover:bg-primary/5"
                onClick={handleJoinMeeting}
              >
                Join meeting
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
