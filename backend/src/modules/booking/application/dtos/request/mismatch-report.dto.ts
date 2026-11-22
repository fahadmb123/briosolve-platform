export interface ReportServiceMismatchInputDto {
    bookingId: string;
    providerUserId: string;
    diagnosis: string;
    visitFee?: number;
    suggestedCategory?: string | null;
    suggestedCategoryId?: string | null;
}

export interface ResolveServiceMismatchInputDto {
    bookingId: string;
    customerId: string;
    action: "ACCEPT" | "DECLINE";
}
