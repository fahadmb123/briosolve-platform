export type LoginInputDto = {
    email: string;
    password: string;
    userAgent?: string | null;
    ipAddress?: string | null;
}