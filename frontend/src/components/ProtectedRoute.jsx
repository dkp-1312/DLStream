import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { authUser, loading } = useAuthContext();

    if (loading) {
        return <div>Loading...</div>;
    }
 
    if (!authUser) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;