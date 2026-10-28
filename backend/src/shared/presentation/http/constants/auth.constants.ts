export const HttpStatus = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const AuthErrorCode = {
    AUTHENTICATION_REQUIRED: "AUTHENTICATION_REQUIRED",
    INVALID_TOKEN: "INVALID_TOKEN",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    ACCOUNT_INACTIVE: "INACTIVE_ACCOUNT",
    ACCOUNT_BLOCKED: "BLOCKED_ACCOUNT",
} as const;

export const AuthErrorMessage = {
    AUTHENTICATION_REQUIRED: "Authentication required",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token",
    USER_NOT_FOUND: "User not found",
    ACCOUNT_INACTIVE: "Inactive Account",
    ACCOUNT_BLOCKED: "Your account has been blocked",
} as const;

export const AuthCookieNames = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
} as const;

