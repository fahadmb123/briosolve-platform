export type response<T> = {
    success: boolean;
    message: string;
    data: T;
    errors?: unknown[] | null;
    timestamp?: string;
    meta?: Record<string, unknown> | null;
};

export * from "../../features/profiles/types/profile.types";
export * from "../../features/availability/types/availability.types";
