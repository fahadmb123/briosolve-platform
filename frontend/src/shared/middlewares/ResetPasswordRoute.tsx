import { Navigate, Outlet } from "react-router-dom";
import { useResetFlowStore } from "../stores/auth/reset-flow.store";

const ResetPasswordRoute = () => {
    const { otpVerified } = useResetFlowStore();

    if (!otpVerified) {
        return <Navigate to="/forgot-password" replace />;
    }

    return <Outlet />;
};

export default ResetPasswordRoute;
