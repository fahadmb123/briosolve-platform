import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth/auth.store";

interface RoleRouteProps {
    allowedRoles: string[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {

    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;