export interface GetAdminKycRequestsInput {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sort?: "asc" | "desc";
}