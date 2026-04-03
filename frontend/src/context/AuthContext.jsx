/* eslint-disable react-refresh/only-export-components -- context + hook in one module */
import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(()=>{
        const storedUser=localStorage.getItem("authUser");
        return storedUser? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await API.get("/auth/me",{withCredentials:true});
                setAuthUser(res.data);
                localStorage.setItem("authUser",JSON.stringify(res.data));
            } catch {
                setAuthUser(null);
                localStorage.removeItem("authUser");
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);
 
    const handleLogout=()=>{
        setAuthUser(null);

        localStorage.removeItem("authUser");
    }

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser, loading, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};