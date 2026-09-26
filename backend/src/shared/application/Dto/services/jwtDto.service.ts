export type JwtPayload = {
    userId: string;
    role: string;
};

export interface IJwtService {
    generate(payload: JwtPayload): string;
    verify(token: string): JwtPayload;
}