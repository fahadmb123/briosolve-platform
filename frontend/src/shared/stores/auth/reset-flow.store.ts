import { create } from "zustand";

interface ResetFlowState {
    resetFlowStarted: boolean;
    otpFlowStarted: boolean;
    otpVerified: boolean;

    setResetFlowStarted: (status: boolean) => void;
    setOtpFlowStarted: (status: boolean) => void;
    setOtpVerified: (status: boolean) => void;
    clearResetFlow: () => void;
}

export const useResetFlowStore = create<ResetFlowState>()((set) => ({
    resetFlowStarted: false,
    otpFlowStarted: false,
    otpVerified: false,

    setResetFlowStarted: (status) => set({ resetFlowStarted: status }),
    setOtpFlowStarted: (status) => set({ otpFlowStarted: status }),
    setOtpVerified: (status) => set({ otpVerified: status }),
    clearResetFlow: () => set({ resetFlowStarted: false, otpFlowStarted: false, otpVerified: false }),
}));
