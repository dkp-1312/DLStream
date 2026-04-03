import React, { useEffect, useMemo, useState, startTransition } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

async function fetchMeetingsSorted() {
  const res = await API.get("/meeting1");
  return [...res.data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    fetchMeetingsSorted().then((sorted) => {
      if (!cancelled) startTransition(() => setMeetings(sorted));
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
      alert("Response recorded");
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
    <main className="min-h-[calc(100dvh-3.5rem)] bg-base-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Meetings
            </h1>
            <p className="mt-1 text-sm text-base-content/65">
              Your scheduled rooms and invitations.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          className="mt-8 flex flex-wrap gap-2"
          aria-label="Filter meetings"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              className={`btn btn-sm rounded-full px-5 font-semibold ${
                filter === tab.id
                  ? "btn-primary shadow-sm"
                  : "btn-ghost border border-base-300 bg-base-100 text-base-content/80 hover:bg-base-200"
              }`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredMeetings.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center shadow-soft">
            <p className="text-base font-medium text-base-content/80">No meetings yet</p>
            <p className="mt-2 text-sm text-base-content/55">
              Create a meeting from the toolbar or home page.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-6 font-semibold"
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
                      <button
                        type="button"
                        className="btn btn-outline btn-sm border-base-300 font-semibold"
                        onClick={() => navigate(`/JoinMeeting/${m.roomName}`)}
                      >
                        Join
                      </button>
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
