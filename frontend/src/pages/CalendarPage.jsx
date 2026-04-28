import React,{useEffect,useState} from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import "react-big-calendar/lib/css/react-big-calendar.css";
 
const localizer = momentLocalizer(moment);

export default function CalendarPage(){
  const [events,setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    async function load(){
      try {
        const res = await API.get("/meeting1");
        const formatted = res.data.map(m=>({
          id: m._id,
          title: m.meetingName,
          start: new Date(m.meetingDate),
          end: new Date(new Date(m.meetingDate).getTime() + 60 * 60 * 1000), // Default 1hr
          isOwner: m.isOwner,
        }));
        setEvents(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[]);

  const handleSelectEvent = (event) => {
    navigate(`/MeetingDetails/${event.id}`);
  };

  return(
    <main className="min-h-[calc(100vh-3.5rem)] py-10 bg-base-200 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-base-200 to-base-200 bg-fixed flex justify-center">
      <div className="w-full max-w-6xl px-4 mt-4">
        <div className="card bg-base-100/70 backdrop-blur-xl shadow-2xl p-6 border border-white/10">
          <div className="mb-6 flex justify-between items-center">
             <div>
               <h1 className="text-3xl font-extrabold tracking-tight text-base-content">Schedule</h1>
               <p className="text-sm text-base-content/60 font-medium">Your upcoming meetings and live events.</p>
             </div>
          </div>
          
          <div style={{height: 600}} className="bg-base-100/50 rounded-xl p-2 border border-base-300 shadow-inner overflow-hidden">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              eventPropGetter={(event) => ({
                className: event.isOwner ? "!bg-primary !border-primary shadow-sm" : "!bg-secondary !border-secondary shadow-sm",
                style: { borderRadius: '6px' }
              })}
            />
          </div>
        </div>
      </div>
    </main>
  );
}