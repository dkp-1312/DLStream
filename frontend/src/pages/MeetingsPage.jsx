import React, { useEffect, useMemo, useState, startTransition } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MeetingCardSkeleton } from "../components/Skeleton";

async function fetchMeetingsSorted() {
  const res = await API.get("/meeting1");
  return [...res.data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetchMeetingsSorted().then((sorted) => {
      if (!cancelled) {
        startTransition(() => {
          setMeetings(sorted);
          setLoading(false);
        });
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const load = async () => {
    const sortedMeetings = await fetchMeetingsSorted();
    startTransition(() => setMeetings(sortedMeetings));
  };

  const respond = async (id, status) => {
    const res = await API.put(`/meeting/${id}/respond`, { status });

    if (res.status === 200) {
      toast.success("Response recorded");
    }

    await load();
  };

  const filteredMeetings = useMemo(() => {
    if (filter === "ALL") return meetings;
    if (filter === "MINE") return meetings.filter((m) => m.isOwner === true);
    if (filter === "INVITES") return meetings.filter((m) => m.isOwner === false);
    return meetings;
  }, [filter, meetings]);

  const filterTabs = [
    { id: "ALL", label: "All" },
    { id: "MINE", label: "Mine" },
    { id: "INVITES", label: "Invites" },
  ];

  return (
    <main className="min-h-[calc(100vh-3.5rem)] py-10 bg-base-200 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-base-200 to-base-200 bg-fixed flex justify-center">
      <div className="mx-auto max-w-7xl px-4 mt-4 w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between px-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-base-content">
              Meetings
            </h1>
            <p className="mt-1 text-sm font-medium text-base-content/65 leading-relaxed">
              Your scheduled sessions, active rooms, and pending invitations.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          className="mt-8 flex flex-wrap gap-2 px-2"
          aria-label="Filter meetings"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              className={`btn btn-sm rounded-full px-5 font-bold transition-all duration-300 ${
                filter === tab.id
                  ? "btn-primary shadow-lg shadow-primary/30"
                  : "btn-ghost bg-base-100/50 backdrop-blur-md border border-base-300/50 text-base-content/70 hover:bg-base-200"
              }`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-8 grid list-none gap-5 sm:grid-cols-2 xl:grid-cols-3 px-2">
            {[...Array(6)].map((_, i) => <MeetingCardSkeleton key={i} />)}
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-base-300 bg-base-100/60 backdrop-blur-xl px-6 py-20 text-center shadow-xl mx-2">
            <div className="bg-base-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-base-content/30">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="text-xl font-bold text-base-content/80 uppercase tracking-tight">No meetings hidden here</p>
            <p className="mt-2 text-sm text-base-content/55 font-medium max-w-xs mx-auto">
              Ready to start something new? Create your first meeting in seconds.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-8 font-bold px-8 shadow-lg shadow-primary/30"
              onClick={() => navigate("/createMeeting")}
            >
              Create meeting
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid list-none gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredMeetings.map((m) => (
              <li key={m._id}>
                <article className="card h-full border border-base-300/80 bg-base-100 shadow-soft transition hover:border-primary/30 hover:shadow-md">
                  <div className="card-body gap-4 p-5 sm:p-6">
                    <h2 className="card-title line-clamp-2 text-lg font-bold leading-snug">
                      {m.meetingName}
                      {m.status === "cancelled" && (
                        <span className="badge badge-error uppercase font-bold text-[10px] ml-2">Cancelled</span>
                      )}
                    </h2>
                    <p className="text-sm text-base-content/65">
                      {new Date(m.meetingDate).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                    <div className="card-actions mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      {!m.isOwner ? (
                        m.status === "pending" ? (
                          <>
                            <button
                              type="button"
                              className="btn btn-success btn-sm flex-1 font-semibold sm:flex-none"
                              onClick={() => respond(m._id, "accepted")}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-warning btn-sm flex-1 font-semibold sm:flex-none"
                              onClick={() => respond(m._id, "declined")}
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className="badge badge-lg badge-outline font-medium capitalize">
                            {m.status}
                          </span>
                        )
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm font-semibold"
                          onClick={() => navigate(`/MeetingDetails/${m._id}`)}
                        >
                          Details
                        </button>
                      )}
                      {m.status !== "cancelled" && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm border-base-300 font-semibold"
                          onClick={() => navigate(`/JoinMeeting/${m.roomName}`)}
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
