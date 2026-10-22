import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/stores/auth.store";
import NotFound from "../../pages/NotFound/NotFound";

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
        //return <Navigate to="/unauthorize" replace />;
        return (
            <>
                <NotFound/>
            </>
        )
    }

    return <Outlet />;
};

export default RoleRoute;
