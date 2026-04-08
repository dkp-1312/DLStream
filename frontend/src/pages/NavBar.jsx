import { Link } from "react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import { API } from "../services/api";

const NavBar = () => {
  const { authUser, handleLogout: contextHandleLogout } = useAuthContext();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!desktopMenuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setDesktopMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [desktopMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = desktopMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [desktopMenuOpen]);

  const handleLogout = async () => {
    try {
      if (contextHandleLogout) await contextHandleLogout();
      setDesktopMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  /* Portal mounts on document.body (outside App theme) — use explicit light palette */
  const panelLinkClass =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900";

  const desktopDrawer =
    authUser &&
    desktopMenuOpen &&
    portalReady &&
    createPortal(
      <>
        <div
          className="fixed inset-0 z-[9998] bg-slate-900/20 transition-opacity duration-200"
          aria-hidden
          onClick={() => setDesktopMenuOpen(false)}
        />
        <aside
          id="desktop-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed left-0 top-0 z-[9999] flex h-[100dvh] max-h-[100dvh] w-[min(18rem,92vw)] max-w-sm flex-col border-r border-slate-200 bg-white text-slate-800 shadow-2xl"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 py-3">
            <span className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Menu
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square border-0 text-slate-600 hover:bg-slate-200/80"
              aria-label="Close menu"
              onClick={() => setDesktopMenuOpen(false)}
            >
              ✕
            </button>
          </div>
          <nav className="scrollbar-thin flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain p-3">
            <Link
              to="/"
              className={panelLinkClass}
              onClick={() => setDesktopMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/meetings"
              className={panelLinkClass}
              onClick={() => setDesktopMenuOpen(false)}
            >
              Meetings
            </Link>
            <Link
              to="/calendar"
              className={panelLinkClass}
              onClick={() => setDesktopMenuOpen(false)}
            >
              Calendar
            </Link>
            <div className="my-2 border-t border-slate-200" />
            <Link
              to="/createMeeting"
              className={panelLinkClass}
              onClick={() => setDesktopMenuOpen(false)}
            >
              Create meeting
            </Link>
            <Link
              to="/create"
              className={panelLinkClass}
              onClick={() => setDesktopMenuOpen(false)}
            >
              Create stream
            </Link>
            <div className="my-2 border-t border-slate-200" />
            <Link
              to="/profile"
              className={panelLinkClass}
              onClick={() => setDesktopMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/settings"
              className={panelLinkClass}
              onClick={() => setDesktopMenuOpen(false)}
            >
              Settings
            </Link>
          </nav>
        </aside>
      </>,
      document.body
    );

  return (
    <>
      {desktopDrawer}

      <header className="sticky top-0 z-[100] border-b border-base-300/80 bg-base-100/85 shadow-nav backdrop-blur-md supports-[backdrop-filter]:bg-base-100/70">
        <div className="navbar mx-auto min-h-14 max-w-7xl gap-2 px-4 sm:px-6 lg:px-8">
          <div className="navbar-start flex-1 gap-2 lg:gap-3">
            <div className="dropdown lg:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-square btn-sm"
                aria-label="Open menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-56 border border-base-300 bg-base-100 p-2 shadow-soft"
              >
                <li>
                  <Link to="/">Home</Link>
                </li>
                {authUser && (
                  <>
                    <li>
                      <Link to="/meetings">Meetings</Link>
                    </li>
                    <li>
                      <Link to="/calendar">Calendar</Link>
                    </li>
                    <li>
                      <Link to="/createMeeting">Create meeting</Link>
                    </li>
                    <li>
                      <Link to="/create">Create stream</Link>
                    </li>
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                      <Link to="/settings">Settings</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {authUser && (
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm hidden lg:inline-flex"
                aria-label="Open navigation menu"
                aria-expanded={desktopMenuOpen}
                aria-controls="desktop-nav-panel"
                onClick={() => setDesktopMenuOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </button>
            )}

            <Link
              to="/"
              className="text-lg font-semibold tracking-tight text-base-content transition hover:opacity-90"
            >
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-bold text-transparent">
                DL Stream
              </span>
            </Link>

            {authUser && (
              <nav className="hidden items-center gap-1 lg:flex">
                <Link
                  to="/meetings"
                  className="btn btn-ghost btn-sm font-medium normal-case text-base-content/80 hover:text-base-content"
                >
                  Meetings
                </Link>
                <Link
                  to="/calendar"
                  className="btn btn-ghost btn-sm font-medium normal-case text-base-content/80 hover:text-base-content"
                >
                  Calendar
                </Link>
              </nav>
            )}
          </div>

          <div className="navbar-center hidden lg:flex">
            {authUser && (
              <div className="join border border-base-300 bg-base-200/60 p-0.5 shadow-inner">
                <Link
                  to="/createMeeting"
                  className="btn btn-primary join-item btn-sm px-4 font-semibold"
                >
                  New meeting
                </Link>
                <Link
                  to="/create"
                  className="btn btn-ghost join-item btn-sm px-4 font-medium text-base-content/90"
                >
                  Go live
                </Link>
              </div>
            )}
          </div>

          <div className="navbar-end flex-1 gap-1 sm:gap-2">
            {authUser ? (
              <>
                <Link
                  to="/notifications"
                  className="btn btn-ghost btn-circle btn-sm"
                  title="Notifications"
                >
                  <span className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    <span className="badge badge-primary badge-xs indicator-item" />
                  </span>
                </Link>
                {authUser.profilePic && (
                  <div className="avatar px-2">
                    <div className="w-8 rounded-full">
                      <img src={authUser.profilePic} alt="Avatar" />
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-outline btn-sm border-base-300 font-medium"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm px-5 font-semibold shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default NavBar;
