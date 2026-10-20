export type RefreshTokenInputDto = {
    refreshToken: string;
    userAgent?: string | null;
    ipAddress?: string | null;
};