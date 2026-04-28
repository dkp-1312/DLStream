import React, { useEffect, useState } from "react";
import { API } from "../services/api";
import { NotificationSkeleton } from "../components/Skeleton";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id, link) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      if (link) {
        window.location.href = link;
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <main className="min-h-[calc(100vh-3.5rem)] py-10 bg-base-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-base-200 to-base-200 bg-fixed flex justify-center">
      <div className="mx-auto max-w-4xl px-4 mt-4 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4 bg-base-100/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/10 mx-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-base-content flex items-center gap-3">
              Inbox
              {!loading && unreadCount > 0 && (
                <span className="badge badge-primary">{unreadCount} new</span>
              )}
            </h1>
            <p className="mt-1 text-sm font-medium text-base-content/65">
              Review and manage your meeting alerts and event invitations.
            </p>
          </div>
          {!loading && unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn btn-outline btn-sm font-bold shadow-sm hover:bg-primary hover:text-primary-content hover:border-primary transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="mx-2">
            {[...Array(8)].map((_, i) => <NotificationSkeleton key={i} />)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-base-300/80 bg-base-100/50 backdrop-blur-sm px-6 py-20 text-center shadow-lg mx-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-200 mb-4 text-base-content/40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-base-content/90">You're all caught up!</h3>
            <p className="mt-2 text-sm text-base-content/60 max-w-md mx-auto">
              You don't have any pending notifications right now. When you receive meeting invitations and system alerts, they will appear here.
            </p>
          </div>
        ) : (
          <div className="bg-base-100/70 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/10 overflow-hidden mx-2">
            <ul className="divide-y divide-base-300/50">
              {notifications.map((n) => (
                <li
                  key={n._id}
                  className={`group relative transition-all duration-300 cursor-pointer ${
                    !n.isRead
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-base-200/50"
                  }`}
                  onClick={() => markAsRead(n._id, n.link)}
                >
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full ${!n.isRead ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]' : 'bg-transparent'}`}></div>
                      <div className="flex flex-col gap-1.5">
                        <span className={`text-base leading-snug ${!n.isRead ? 'font-bold text-base-content' : 'font-medium text-base-content/80'}`}>{n.message}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                            {new Date(n.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                    </div>
                    {n.link && (
                      <div className="ml-6 sm:ml-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="btn btn-sm btn-outline btn-circle text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                         </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
};

export default NotificationsPage;