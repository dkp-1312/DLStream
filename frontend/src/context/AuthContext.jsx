import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import API from "../services/api";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(()=>{
        const storedUser = localStorage.getItem("authUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser) {
          const socketInstance = io(API_URL, {
            query: {
              userId: authUser._id || authUser.id,
            },
          });
    
          setSocket(socketInstance);
    
          // socketInstance.on("connect", () => console.log("Connected to socket"));
    
          return () => {
            socketInstance.close();
            setSocket(null);
          };
        } else {
          if (socket) {
            socket.close();
            setSocket(null);
          }
        }
      }, [authUser]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await API.get("/auth/me", { withCredentials: true });
                if (res.data) {
                    setAuthUser(res.data);
                    localStorage.setItem("authUser", JSON.stringify(res.data));
                }
            } catch {
                // If API fails, we let Firebase handle it
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Sync with backend to get Mongo User object & set JWT cookie
                    const res = await API.post("/auth/google", {
                        email: user.email,
                        fullName: user.displayName || user.email.split('@')[0],
                        profilePic: user.photoURL
                    });
                    
                    if (res.data.success) {
                        const mongoUser = res.data.user;
                        localStorage.setItem("authUser", JSON.stringify(mongoUser));
                        setAuthUser(mongoUser);
                    }
                } catch (error) {
                    console.error("Failed to sync Google user with backend:", error);
                    // Fallback (not recommended as it lacks _id)
                    // const userData = { uid: user.uid, email: user.email, ... };
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
 
    const handleLogout = async () => {
        try {
            try {
                await API.post("/auth/logout");
            } catch (error) {
                // Ignore API logout error if user wasn't logged in via email
            }
            
            try {
                await signOut(auth);
            } catch (error) {
                // Ignore Firebase logout error if user wasn't logged in via Google
            }
        } finally {
            setAuthUser(null);
            localStorage.removeItem("authUser");
        }
    };

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loading, handleLogout, socket }}>
            {children}
        </AuthContext.Provider>
    );
};