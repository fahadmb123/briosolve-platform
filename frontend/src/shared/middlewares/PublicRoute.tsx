import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth/auth.store";

const PublicRoute = () => {
    const { isAuthenticated, user } = useAuthStore()
    
    if (isAuthenticated) {
        if (user && user.role !== "CUSTOMER") {
            return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
        }
        return <Navigate to="/" replace />;
    }
    
    return <Outlet />
};

export default PublicRoute;