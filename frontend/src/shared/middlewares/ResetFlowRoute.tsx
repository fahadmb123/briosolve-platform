import { Navigate, Outlet } from "react-router-dom";
import { useResetFlowStore } from "../../store/auth/reset-flow.store";

const ResetFlowRoute = () => {
    const { resetFlowStarted } = useResetFlowStore();

    if (!resetFlowStarted) {
        return <Navigate to="/forgot-password" replace />;
    }

    return <Outlet />;
};

export default ResetFlowRoute;
