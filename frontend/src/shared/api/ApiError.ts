import { isAxiosError } from "axios";

export interface ApiErrorPayload {
    message?: string;
    [key: string]: unknown;
}

export class ApiError extends Error {
    public status?: number;
    public data?: unknown;

    constructor(message: string, status?: number, data?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

export function normalizeApiError(err: unknown): ApiError {
    if (err instanceof ApiError) {
        return err;
    }

    let message = "An unexpected error occurred";
    let status: number | undefined;
    let data: unknown;

    if (isAxiosError(err)) {
        status = err.response?.status;
        data = err.response?.data;
        const responseData = data as ApiErrorPayload | undefined;
        if (responseData && typeof responseData.message === "string") {
            message = responseData.message;
        } else if (err.message) {
            message = err.message;
        }
    } else if (err instanceof Error) {
        message = err.message;
    }

    return new ApiError(message, status, data);
}
