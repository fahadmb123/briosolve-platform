export type UpdateUserStatusDto = {
    id: string;
    status: string;
    reason?: string;
    adminId?: string;
}