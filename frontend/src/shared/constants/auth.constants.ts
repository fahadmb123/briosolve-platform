export const HttpStatus = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
} as const;

export const AuthErrorCode = {
    BLOCKED_ACCOUNT: "BLOCKED_ACCOUNT",
    INACTIVE_ACCOUNT: "INACTIVE_ACCOUNT",
} as const;

export const UserStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    BLOCKED: "BLOCKED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

