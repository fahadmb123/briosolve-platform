import { create } from "zustand";

export type UserRole =
    | "CUSTOMER"
    | "PROVIDER"
    | "ADMIN"
    | "INVESTIGATOR";

export interface IAuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: 'ACTIVE' | 'BLOCKED' | 'PENDING';
    phone?: string | null;
    email_verified: boolean;
    phone_verified: boolean;
    created_at: string;
    updated_at: string;
}

interface IAuthState {
    user: IAuthUser | null;
    isAuthenticated: boolean;

    setUser: (user: IAuthUser) => void;
    clearAuth: () => void;
}


export const useAuthStore = create<IAuthState>()((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user:IAuthUser) =>
        set({
            user,
            isAuthenticated: true,
        }),

    clearAuth: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
}));