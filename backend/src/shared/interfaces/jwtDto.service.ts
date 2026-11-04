export type JwtPayload = {
    userId: string;
    role: string;
};

export interface IJwtService {
    generate(payload: JwtPayload, expiresIn?: string): string;
    verify(token: string): JwtPayload;
    generateRefreshToken(payload: JwtPayload, expiresIn?: string): string;
    verifyRefreshToken(token: string): JwtPayload;
}