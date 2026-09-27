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
    phone?:string | null
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