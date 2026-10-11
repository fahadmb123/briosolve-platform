import { create } from "zustand";
import { getMe } from "../../modules/auth/services/auth.service";
import type { Address } from "../../shared/Dtos/address";
import type { CustomerProfile, ProviderProfile } from "../../shared/types/Dtos";

export type UserRole =
    | "CUSTOMER"
    | "PROVIDER"
    | "ADMIN";

export interface IAuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    current_address_id: Address | null;
    status: 'ACTIVE' | 'BLOCKED' | 'PENDING';
    phone?: string | null;
    email_verified: boolean;
    phone_verified: boolean;
    created_at: string;
    updated_at: string;
}

interface IAuthState {
    user: IAuthUser | null;
    profile: CustomerProfile | ProviderProfile | null;
    isAuthenticated: boolean;

    setUser: (user: IAuthUser) => void;
    setProfile: (profile: CustomerProfile | ProviderProfile | null) => void;
    clearAuth: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<IAuthState>()((set) => ({
    user: null,
    profile: null,
    isAuthenticated: false,

    setUser: (user: IAuthUser) =>
        set({
            user,
            isAuthenticated: true,
        }),
        
    setProfile: (profile: CustomerProfile | ProviderProfile | null) =>
        set({
            profile,
        }),

    clearAuth: () =>
        set({
            user: null,
            profile: null,
            isAuthenticated: false,
        }),
    fetchUser: async () => {
        try {
            const response = await getMe();
            const userData = response.data;
            
            set({
                user: userData,
                profile: userData.customer_profile || userData.provider_profile || null,
                isAuthenticated: true,
            });
        } catch (error) {
            console.log(error);
            set({
                user: null,
                profile: null,
                isAuthenticated: false,
            });
        }
    }
}));