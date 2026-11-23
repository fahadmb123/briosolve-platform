export interface SubmitWarrantyClaimInputDto {
    bookingId: string;
    customerId: string;
    issueDescription: string;
    proofImages?: string[];
    preferredDate?: string;
    preferredTime?: string;
}

export interface ResolveWarrantyClaimInputDto {
    bookingId: string;
    providerUserId: string;
    action: "ACCEPT" | "REJECT" | "RESOLVE";
    revisitScheduledDate?: string;
    revisitScheduledTime?: string;
    providerResponse?: string;
    rejectionReason?: string;
}
