import { Navigate, Outlet } from "react-router-dom";
import { useResetFlowStore } from "../stores/reset-flow.store";
import { useAuthStore } from "../stores/auth.store";

const OtpFlowRoute = () => {
    const { otpFlowStarted } = useResetFlowStore();
    const { isAuthenticated, user } = useAuthStore();

    if (!otpFlowStarted) {
        if (isAuthenticated && user?.role === "PROVIDER") {
            return <Navigate to="/provider/settings" replace />;
        }
        if (isAuthenticated && user?.role === "CUSTOMER") {
            return <Navigate to="/settings" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default OtpFlowRoute;
