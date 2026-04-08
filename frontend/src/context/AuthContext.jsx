/* eslint-disable react-refresh/only-export-components -- context + hook in one module */
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import API from "../services/api";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(()=>{
        const storedUser = localStorage.getItem("authUser");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await API.get("/auth/me", { withCredentials: true });
                setAuthUser(res.data);
                localStorage.setItem("authUser", JSON.stringify(res.data));
            } catch {
                // If API fails, we let Firebase handle it
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                };
                setAuthUser((prev) => {
                    localStorage.setItem("authUser", JSON.stringify(userData));
                    return userData;
                });
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
        <AuthContext.Provider value={{ authUser, setAuthUser, loading, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};