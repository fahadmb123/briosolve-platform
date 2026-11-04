import { ApplicationError } from "../../../application/errors/applicationError";
import { ErrorKind } from "../../../application/errors/errorKind";

const statusMap: Record<ErrorKind, number> = {
    VALIDATION: 422,
    AUTHENTICATION: 401,
    AUTHORIZATION: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    PRECONDITION: 412,
    RATE_LIMIT: 429,
    UNSUPPORTED: 415,
    INTERNAL: 500,
}

export class HttpErrorMapper {
    static map(error: unknown) {
        const isApplicationError = error instanceof ApplicationError || 
            (error instanceof Error && error.name === "ApplicationError");

        if (isApplicationError) {
            const appError = error as ApplicationError;
            return {
                statusCode: statusMap[appError.kind] || 500,
                code: appError.code,
                message: appError.message,
            }
        }

        if (typeof error === "object" && error !== null && ("statusCode" in error || "status" in error)) {
            const err = error as { statusCode?: number; status?: number; code?: string; message?: string };
            const statusCode = err.statusCode || err.status || 500;
            return {
                statusCode,
                code: err.code || (statusCode === 413 ? "PAYLOAD_TOO_LARGE" : "REQUEST_ERROR"),
                message: err.message || "Request error",
            };
        }

        return {
            statusCode: 500,
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        }
    }
}
