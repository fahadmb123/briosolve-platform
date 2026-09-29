import { Navigate, Outlet } from "react-router-dom";
import { useResetFlowStore } from "../../store/auth/reset-flow.store";

const OtpFlowRoute = () => {
    const { otpFlowStarted } = useResetFlowStore();

    if (!otpFlowStarted) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default OtpFlowRoute;
