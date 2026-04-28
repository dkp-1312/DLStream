import { createBrowserRouter, RouterProvider,Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import { Toaster } from "react-hot-toast";
import NavBar from "./pages/NavBar";

import Home from "./pages/Home";
import Broadcast from "./pages/Broadcast";
import Watch from "./pages/Watch";
import Ax from "./pages/Ax";
import ProtectedRoute from "./components/ProtectedRoute";

import CreateStream from "./pages/CreateStream";
import WatchStream from "./pages/WatchStream";
import ChatRoom from "./components/ChatRoom";

import { useAuthContext } from "./context/AuthContext.jsx";

import CreateMeeting from "./pages/CreateMeeting.jsx";
import MeetingsPage from "./pages/MeetingsPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import MeetingDetails from "./pages/MeetingDetails.jsx";
import CreateMeeting1 from "./pages/CreateMeeting1.jsx";
import MeetingRoom from "./pages/MeetingRoom";
import JoinMeeting from "./pages/JoinMeeting.jsx";
import Profile from "./pages/Profile.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import Settings from "./pages/Settings.jsx";

const App = () => {
  const { authUser} = useAuthContext();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><NavBar/> <HomePage /></>,
    },
    {
      path:"/home",
      element: <ProtectedRoute><><NavBar/> <Home/></></ProtectedRoute>,
    },
    {
      path:"/create",
      element: <ProtectedRoute><><NavBar/><CreateStream/></></ProtectedRoute>
    },
    {
      path:"/watch/:key",
      element: <ProtectedRoute><><NavBar/> <WatchStream/></></ProtectedRoute>,
    },
    {
      path:"/createMeeting",
      element:<ProtectedRoute><><NavBar/><CreateMeeting/></></ProtectedRoute>
    },
    {
      path:"/createMeeting1",
      element:<ProtectedRoute><><NavBar/><CreateMeeting1/></></ProtectedRoute>
    },
    {
      path:"/meetings",
      element:<ProtectedRoute><><NavBar/><MeetingsPage/></></ProtectedRoute>
    },
    {
      path:"/calendar",
      element:<ProtectedRoute><><NavBar/><CalendarPage/></></ProtectedRoute>
    },
    {
      path:"/MeetingDetails/:meetingId",
      element:<ProtectedRoute><><NavBar/><MeetingDetails/></></ProtectedRoute>
    },
    {
      path:"/JoinMeeting/:roomName",
      element:<ProtectedRoute><><NavBar/><JoinMeeting/></></ProtectedRoute>
    },
    {
      path:"/chat/:roomName",
      element:<ProtectedRoute><><ChatRoom/></></ProtectedRoute>
    },
    {
      path:"/broadcast/:id",
      element: <ProtectedRoute><><NavBar/> <Broadcast/></></ProtectedRoute>,
    },
    {
      path:"/stream/:id",
      element: <ProtectedRoute><><NavBar/> <Watch/></></ProtectedRoute>,
    },
    {
      path: "/login",
      element:!authUser?(<><NavBar/> <LoginPage /></>):(<Navigate to="/" replace/>),
    },
    {
      path: "/signup",
      element: !authUser?( <><NavBar/><SignUpPage /></>):(<Navigate to="/" replace/>),
    },
    {
      path: "/profile",
      element: <ProtectedRoute><><NavBar/><Profile /></></ProtectedRoute>,
    },
    {
      path: "/editProfile",
      element: <ProtectedRoute><><NavBar/><EditProfile /></></ProtectedRoute>,
    },
    {
      path: "/settings",
      element: <ProtectedRoute><><NavBar/><Settings /></></ProtectedRoute>,
    },
    {
      path: "/notifications",
      element: <ProtectedRoute><><NavBar/> <NotificationsPage /></></ProtectedRoute>,
    },
    {
      path: "/Ax",
      element: (
        <ProtectedRoute>
          <><NavBar /><Ax /></>
        </ProtectedRoute>
      ),
    },
    {
      path: "/meeting/:meetingId",
      element: <ProtectedRoute><><NavBar /><MeetingRoom /></></ProtectedRoute>,
    },
  ]);
  return (
    <div className="min-h-dvh flex flex-col bg-base-200" data-theme="dlstream">
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "!bg-base-100 !text-base-content !shadow-soft !border !border-base-300",
          duration: 4000,
        }}
      />
    </div>
  );
}; 

export default App;
