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

const App = () => {
  const { authUser} = useAuthContext();
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><NavBar/> <HomePage /></>,
    },
    {
      path:"/home",
      element: <><NavBar/> <Home/></>,
    },
    {
      path:"/create",
      element:<><NavBar/><CreateStream/></>
    },
    {
      path:"/watch/:key",
      element: <><NavBar/> <WatchStream/></>,
    },
    {
      path:"/createMeeting",//LiveKit
      element:<><NavBar/><CreateMeeting/></>
    },
    {
      path:"/createMeeting1",
      element:<><NavBar/><CreateMeeting1/></>
    },
    {
      path:"/meetings",
      element:<><NavBar/><MeetingsPage/></>
    },
    {
      path:"/calendar",
      element:<><NavBar/><CalendarPage/></>
    },
    {
      path:"/MeetingDetails/:meetingId",
      element:<><NavBar/><MeetingDetails/></>
    },
    {
      path:"/JoinMeeting/:roomName",//Livekit
      element:<><NavBar/><JoinMeeting/></>
    },
    {
      path:"/chat/:roomName",
      element:<><ChatRoom/></>
    },
    {
      path:"/broadcast/:id",
      element: <><NavBar/> <Broadcast/></>,
    },
    {
      path:"/stream/:id",
      element: <><NavBar/> <Watch/></>,
    },
    {
      path: "/login",
      element:!authUser?(<><NavBar/> <LoginPage /></>):(<Navigate to="/"  replace/>),
    },
    {
      path: "/signup",
      element: !authUser?( <><NavBar/><SignUpPage /></>):(<Navigate to="/"  replace/>),
    },
    {
      path: "/notifications",
      element: <><NavBar/> <NotificationsPage /></>,
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
      element: <><NavBar /><MeetingRoom /></>,
    },
  ]);
  return (
    <div className="h-screen" data-theme="winter">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}; 

export default App;