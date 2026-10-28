import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/stores/auth.store";
import { UserStatus } from "../../../shared/constants/auth.constants";

const PublicRoute = () => {
    const { isAuthenticated, user } = useAuthStore();
    
    if (isAuthenticated) {
        if (user?.status === UserStatus.BLOCKED || user?.status === UserStatus.INACTIVE) {
            return <Outlet />;
        }
        if (user && user.role !== "CUSTOMER") {
            return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
        }
        return <Navigate to="/" replace />;
    }
    
    return <Outlet />;
};

export default PublicRoute;
