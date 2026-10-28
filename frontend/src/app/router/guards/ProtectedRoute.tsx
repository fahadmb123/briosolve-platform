import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/stores/auth.store";
import { UserStatus } from "../../../shared/constants/auth.constants";

const ProtectedRoute = () => {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (user?.status === UserStatus.BLOCKED || user?.status === UserStatus.INACTIVE) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
