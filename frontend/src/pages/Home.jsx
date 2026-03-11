import React, { useEffect, useState } from "react";
import { API } from "../services/api.js";
import { Link } from "react-router-dom";

export default function Home() {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    API.get("/streams").then((res) => setStreams(res.data));
  }, []);

  return (
    <div>
      <h2>🔥 Live Streams</h2>
      {streams.map((s) => (
        <div key={s._id}>
          <Link to={`/watch/${s.streamKey}`}>
            <h3>{s.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
}
