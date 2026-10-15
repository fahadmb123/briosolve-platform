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

        return {
            statusCode: 500,
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        }
    }
}