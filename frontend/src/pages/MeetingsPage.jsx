import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function MeetingsPage() {

  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/meeting");

    const sortedMeetings = res.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  
    setMeetings(sortedMeetings);
    setFilteredMeetings(sortedMeetings);
  };

  const respond = async (id, status) => {
    const res = await API.put(`/meeting/${id}/respond`, { status });

    if (res.status === 200) {
      alert("Response recorded");
    }

    load();
  };

  // Filtering logic
  useEffect(() => {

    if (filter === "ALL") {
      setFilteredMeetings(meetings);

    } else if (filter === "MINE") {
      setFilteredMeetings(
        meetings.filter(m => m.isOwner === true)
      );

    } else if (filter === "INVITES") {
      setFilteredMeetings(
        meetings.filter(m => m.isOwner === false)
      );
    }

  }, [filter, meetings]);

  return (
    <div className="bg-white">

      <h2>All Meetings</h2>

      {/* Filter Buttons */}
      <div style={{marginBottom:20}}>

        <button className="btn btn-primary m-3" onClick={()=>setFilter("ALL")}>
          All
        </button>

        <button className="btn btn-secondary m-3" onClick={()=>setFilter("MINE")}>
          Mine
        </button>

        <button className="btn btn-info m-3" onClick={()=>setFilter("INVITES")}>
          Invites
        </button>

      </div>
      <div className="grid grid-cols-3 gap-4 m-2">

      {filteredMeetings.map(m => (
        
        <div key={m._id} className="card bg-base-100 w-96 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">{m.meetingName}</h2>
    <p> Date: {new Date(m.meetingDate).toLocaleString()}</p>
    <div className="card-actions justify-start">
    {!m.isOwner ? 
    (
    m.status=="pending"?
    (<><button
            className="btn btn-success"
            onClick={()=>respond(m._id,"accepted")}
          >
            Accept
          </button>

          <button
            className="btn btn-warning"
            onClick={()=>respond(m._id,"declined")}
          >
            Decline
          </button></>
        )
        :
        (
          <button
            className="btn btn-success"
           
          >
           {m.status}
          </button>
        )
        ):(<><button className="btn btn-primary" onClick={()=>navigate(`/MeetingDetails/${m._id}`)}>
            View Details
          </button></>)}
    </div>
  </div>
</div>
        

      ))}
      </div>

    </div>
  );
}