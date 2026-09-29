import { isAxiosError } from "axios";

export class ApiError extends Error {
    public status?: number;
    public data?: any;

    constructor(message: string, status?: number, data?: any) {
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
    let data: any;

    if (isAxiosError(err)) {
        status = err.response?.status;
        data = err.response?.data;
        if (data?.message) {
            message = data.message;
        } else if (err.message) {
            message = err.message;
        }
    } else if (err instanceof Error) {
        message = err.message;
    }

    return new ApiError(message, status, data);
}
