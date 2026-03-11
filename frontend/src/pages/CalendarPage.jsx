import React,{useEffect,useState} from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import API from "../services/api";

import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarPage(){

  const [events,setEvents] = useState([]);

  useEffect(()=>{

    async function load(){

      const res = await API.get("/meeting");

      const formatted = res.data.map(m=>({
        title:m.meetingName,
        start:new Date(m.meetingDate),
        end:new Date(m.meetingDate),
        isOwner:m.isOwner,
      }));

      setEvents(formatted);
    }

    load();

  },[]);

  return(

    <div style={{height:500}} className="bg-white">

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
      />

    </div>
  );
}