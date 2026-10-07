import { create } from "zustand";
import { getMe } from "../../modules/auth/services/auth.service";

export type UserRole =
    | "CUSTOMER"
    | "PROVIDER"
    | "ADMIN";

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
    fetchUser: () => Promise<void>;
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
    fetchUser: async () => {
        try {
            const response = await getMe();
            set({
                user: response.data as unknown as IAuthUser,
                isAuthenticated: true,
            });
        } catch (error) {
            console.log(error)
            set({
                user: null,
                isAuthenticated: false,
            });
        }
    }
}));