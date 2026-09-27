import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth/auth.store";

const PublicRoute = () => {
    const { isAuthenticated} = useAuthStore()
    if (isAuthenticated) return <Navigate to="/" replace />
    return <Outlet />
};

export default PublicRoute;