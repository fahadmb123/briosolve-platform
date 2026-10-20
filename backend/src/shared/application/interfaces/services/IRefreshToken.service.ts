export interface IRefreshTokenService {
    generateToken(): string;
    hashToken(token: string): string;
}
