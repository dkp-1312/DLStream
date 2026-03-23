import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [streamKey, setStreamKey] = useState("");
  
  console.log(import.meta.env.VITE_API_URL);
  const handleWatch = () => {
    if (streamKey.trim() !== "") {
      navigate(`/watch/${streamKey}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="flex w-full flex-col justify-center lg:flex-row">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-4">

          <h2 className="card-title justify-center text-2xl mb-2">
            Live Streaming App
          </h2>

          <button className="btn btn-primary w-full"  onClick={() => navigate("/create")} >
            Create Stream
          </button>

          <div className="divider">OR</div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Enter Stream Key</span>
            </label>
            <input
              type="text"
              placeholder="Enter stream key..."
              className="input input-bordered w-full"
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
            />
          </div>
 
          <button
            className="btn btn-secondary w-full"
            onClick={handleWatch}
          >
            Watch Stream
          </button>

        </div>
      </div>
      <div className="divider lg:divider-horizontal"></div>

      {/* Divider */}
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body gap-4">

          <h2 className="card-title justify-center text-2xl mb-2">
            Live Meeting App
          </h2>

          <button className="btn btn-primary w-full"  onClick={() => navigate("/createMeeting")} >
            Create Meeting
          </button>

          <div className="divider">OR</div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Enter Meeting Id</span>
            </label>
            <input
              type="text"
              placeholder="Enter meeting id..."
              className="input input-bordered w-full"
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
            />
          </div>
 
          <button
            className="btn btn-secondary w-full"
            onClick={handleWatch}
          >
            Join Meeting
          </button>

        </div>
      </div>
      </div>
    </div>
  );
};

export default HomePage;