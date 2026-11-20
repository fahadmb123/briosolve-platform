export interface ReportServiceMismatchInputDto {
    bookingId: string;
    providerUserId: string;
    diagnosis: string;
    suggestedCategory?: string | null;
    suggestedCategoryId?: string | null;
}

export interface ResolveServiceMismatchInputDto {
    bookingId: string;
    customerId: string;
    action: "ACCEPT" | "DECLINE";
}

export interface ReopenRequestWithDiagnosisInputDto {
    bookingId: string;
    customerId: string;
}
