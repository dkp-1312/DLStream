import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function MeetingDetails() {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await API.get(`/meeting/${meetingId}`);
        setMeeting(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error("Access denied.");
          navigate("/meetings");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId, navigate]);

  const handleCancelMeeting = async () => {
    if (!window.confirm("Are you sure you want to cancel this meeting? Participants will be notified.")) return;
    
    try {
      await API.put(`/meeting1/cancel/${meetingId}`);
      toast.success("Meeting cancelled successfully");
      navigate("/meetings");
    } catch (error) {
      toast.error("Failed to cancel meeting");
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleDate) return toast.error("Please select a new date");
    
    try {
      await API.put(`/meeting1/reschedule/${meetingId}`, { newDate: rescheduleDate });
      toast.success("Meeting rescheduled successfully");
      setIsRescheduling(false);
      // Refresh data
      const res = await API.get(`/meeting/${meetingId}`);
      setMeeting(res.data);
    } catch (error) {
      toast.error("Failed to reschedule meeting");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex justify-center items-center bg-base-200">
        <span className="loading loading-bars text-primary loading-lg"></span>
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <main className="min-h-[calc(100vh-3.5rem)] py-10 bg-base-200 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-base-200 to-base-200 bg-fixed flex justify-center">
      <div className="w-full max-w-4xl px-4 mt-4">
        <div className="card bg-base-100/70 backdrop-blur-xl shadow-2xl border border-white/10 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${meeting.status === 'cancelled' ? 'from-error to-error/50' : 'from-primary via-secondary to-accent'}`}></div>
          
          <div className="card-body p-8 sm:p-10 gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-base-content flex items-center gap-3">
                  {meeting.meetingName}
                  {meeting.status === 'cancelled' && <span className="badge badge-error uppercase font-bold text-[10px]">Cancelled</span>}
                </h1>
                <p className="text-base-content/60 font-medium mt-1">Room ID: {meeting.roomName}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-sm shadow-sm"
                  onClick={() => navigate("/meetings")}
                >
                  Back
                </button>
                {meeting.status !== 'cancelled' && (
                  <button
                    className="btn btn-error btn-outline btn-sm shadow-sm"
                    onClick={handleCancelMeeting}
                  >
                    Cancel Meeting
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Meeting Schedule</h3>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{new Date(meeting.meetingDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <p className="text-base-content/60">{new Date(meeting.meetingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                
                {meeting.status !== 'cancelled' && (
                  <div className="pt-2">
                    {!isRescheduling ? (
                      <button onClick={() => setIsRescheduling(true)} className="text-sm font-bold text-primary hover:underline">Reschedule meeting</button>
                    ) : (
                      <div className="space-y-2 animate-fade-in-up">
                        <input 
                          type="datetime-local" 
                          className="input input-bordered input-sm w-full"
                          onChange={(e) => setRescheduleDate(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button onClick={handleReschedule} className="btn btn-primary btn-xs">Confirm</button>
                          <button onClick={() => setIsRescheduling(false)} className="btn btn-ghost btn-xs">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
                <h3 className="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-4">Participant Status</h3>
                <div className="flex -space-x-3 overflow-hidden mb-4">
                  {meeting.invitations.map((inv, i) => (
                    <div key={i} className={`inline-block h-10 w-10 rounded-full ring-2 ring-base-100 bg-base-300 flex items-center justify-center text-xs font-bold border-t-2 ${inv.status === 'accepted' ? 'border-success' : inv.status === 'declined' ? 'border-error' : 'border-warning'}`}>
                      {inv.email.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-base-content/70">
                  {meeting.invitations.filter(i => i.status === 'accepted').length} Accepted · {meeting.invitations.filter(i => i.status === 'pending').length} Pending
                </p>
              </div>
            </div>

            <div className="bg-base-100/50 rounded-2xl border border-base-300 shadow-inner overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200/50">
                    <tr>
                      <th className="font-bold text-base-content/60">Invitees</th>
                      <th className="font-bold text-base-content/60 text-right">Response</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meeting.invitations.map((inv, index) => (
                      <tr key={index} className="hover:bg-base-200/30 transition-colors">
                        <td className="font-medium">{inv.email}</td>
                        <td className="text-right">
                          <span
                            className={`badge badge-sm font-bold uppercase text-[10px] ${
                              inv.status === "accepted"
                                ? "badge-success"
                                : inv.status === "declined"
                                ? "badge-error"
                                : "badge-warning"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}