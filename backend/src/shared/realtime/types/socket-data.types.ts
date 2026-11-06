export interface AuthenticatedSocketData {
    userId: string;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export interface SocketData {
    user: AuthenticatedSocketData;
}
