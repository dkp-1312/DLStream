import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";

export default function CreateMeeting() {
  const [meetingName, setMeetingName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  const addEmail = () => {
    const trimmed = emailInput.trim().replace(/,/g, '');
    if (!trimmed) return;
    
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (emails.includes(trimmed)) {
      toast.error("Email already added");
      return;
    }

    setEmails([...emails, trimmed]);
    setEmailInput("");
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const submit = async () => {
    if (!meetingName || !meetingDate) {
      toast.error("Meeting Name and Date are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/meeting1/create", {
        meetingName,
        meetingDate,
        invitations: emails,
      });
      toast.success("Meeting Created Successfully!");
      // Reset form
      setMeetingName("");
      setMeetingDate("");
      setEmails([]);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex justify-center py-10 bg-base-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-base-200 to-base-200 bg-fixed">
      <div className="w-full max-w-lg mt-8">
        <div className="card bg-base-100/60 backdrop-blur-xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Header Graphic */}
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
          
          <div className="card-body p-8 sm:p-10 gap-6">
            <div className="text-center mb-2">
              <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Schedule Meeting
              </h2>
              <p className="text-sm text-base-content/60 mt-2">
                Set up a new session and invite your participants cleanly.
              </p>
            </div>

            <div className="form-control w-full space-y-1">
              <label className="label">
                <span className="label-text font-semibold text-base-content/80">Meeting Name</span>
              </label>
              <input
                type="text"
                placeholder="E.g., Weekly Sync"
                className="input input-bordered w-full bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
              />
            </div>

            <div className="form-control w-full space-y-1">
              <label className="label">
                <span className="label-text font-semibold text-base-content/80">Date & Time</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
              />
            </div>

            <div className="form-control w-full space-y-1">
              <label className="label pb-0">
                <span className="label-text font-semibold text-base-content/80">Invitees</span>
              </label>
              <label className="label pt-0">
                <span className="label-text-alt text-base-content/50">Press Enter or Space to add an email.</span>
              </label>
              
              <div className={`p-2 min-h-12 border rounded-lg bg-base-100 border-base-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-200 flex flex-wrap gap-2 items-center`}>
                {emails.map((email, idx) => (
                  <span key={idx} className="badge badge-primary gap-1 py-3 px-3 shadow-sm animate-fade-in-up">
                    {email}
                    <button 
                      type="button"
                      className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
                      onClick={() => removeEmail(email)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                
                <input
                  type="text"
                  className="flex-grow bg-transparent outline-none text-sm min-w-[120px] px-1 py-1"
                  placeholder={emails.length === 0 ? "participant@example.com" : "Add more..."}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={addEmail}
                />
              </div>
            </div>

            <button
              className={`btn btn-primary w-full mt-4 shadow-lg hover:shadow-primary/40 transition-all duration-300 ${loading ? 'loading' : ''}`}
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                  Send Invitations & Create
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}