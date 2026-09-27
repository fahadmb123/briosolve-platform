import { create } from "zustand";

interface ResetFlowState {
    resetFlowStarted: boolean;
    otpVerified: boolean;

    setResetFlowStarted: (status: boolean) => void;
    setOtpVerified: (status: boolean) => void;
    clearResetFlow: () => void;
}

export const useResetFlowStore = create<ResetFlowState>()((set) => ({
    resetFlowStarted: false,
    otpVerified: false,

    setResetFlowStarted: (status) => set({ resetFlowStarted: status }),
    setOtpVerified: (status) => set({ otpVerified: status }),
    clearResetFlow: () => set({ resetFlowStarted: false, otpVerified: false }),
}));
