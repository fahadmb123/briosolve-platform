import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth/auth.store";



const ProtectedRoute = () => {
    const {isAuthenticated, user} = useAuthStore()
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.status === 'BLOCKED') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;