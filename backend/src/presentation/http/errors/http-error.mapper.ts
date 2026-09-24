import { ApplicationError } from "../../../application/errors/application-error.js";
import { ErrorKind } from "../../../application/errors/error-kind.js";

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
        if (error instanceof ApplicationError) {
            return {
                statusCode: statusMap[error.kind],
                code: error.code,
                message: error.message,
            }
        }

        return {
            statusCode: 500,
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        }
    }
}