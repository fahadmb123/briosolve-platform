import { create } from "zustand";
import { getMe } from "../services/auth.service";
import type { Address } from "../../addresses";
import type { CustomerProfile, ProviderProfile } from "../../profiles";
import { UserStatus } from "../../../shared/constants/auth.constants";

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
    status: UserStatus;
    phone?: string | null;
    email_verified: boolean;
    phone_verified: boolean;
    created_at: string;
    updated_at: string;
    customer_profile?: CustomerProfile | null;
    provider_profile?: ProviderProfile | null;
}

export interface IProviderVerifications {
    phone: boolean;
    email: boolean;
    identity: boolean;
    address: boolean;
}

export interface ICustomerVerifications {
    phone: boolean;
    email: boolean;
    address: boolean;
}

export type IVerifications =
    | IProviderVerifications
    | ICustomerVerifications;

interface IAuthState {
    verifications:IVerifications | null
    isSuspended:boolean
    user: IAuthUser | null;
    profile: CustomerProfile | ProviderProfile | null;
    isAuthenticated: boolean;

    setSuspended: (suspended: boolean) => void;
    setUser: (user: IAuthUser) => void;
    setProfile: (profile: CustomerProfile | ProviderProfile | null) => void;
    clearAuth: () => void;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<IAuthState>()((set) => ({
    verifications:null,
    isSuspended:false,
    user: null,
    profile: null,
    isAuthenticated: false,



    setSuspended: (suspended: boolean) =>
        set({
            isSuspended:suspended
        }),
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
            verifications: null,
            isAuthenticated: false,
            isSuspended: false,
        }),
    fetchUser: async () => {
        try {
            const response = await getMe();
            const userData = response.data;
            const isBlocked = userData?.status === UserStatus.BLOCKED;

            const verifications: IVerifications =
                userData.role === "PROVIDER"
                    ? {
                        phone: userData.phone_verified,
                        email: userData.email_verified,
                        identity: userData.provider_profile?.kyc_status === "APPROVED",
                        address: userData.current_address_id !== null,
                    }
                    : {
                        phone: userData.phone_verified,
                        email: userData.email_verified,
                        address: userData.current_address_id !== null,
                    };


            set({
                user: userData,
                profile: userData.customer_profile || userData.provider_profile || null,
                verifications:verifications,
                isAuthenticated: !isBlocked,
                isSuspended: isBlocked,
            });
        } catch (err: any) {
            const isBlocked =
                err?.response?.data?.code === "BLOCKED_ACCOUNT" ||
                err?.response?.status === 403;
            set({
                user: null,
                profile: null,
                verifications: null,
                isAuthenticated: false,
                isSuspended: isBlocked,
            });
        }
    },
}));
