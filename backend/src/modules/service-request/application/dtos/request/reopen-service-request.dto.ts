export interface ReopenServiceRequestInputDto {
    customerId: string;
    requestId: string;
    urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
    specificDate?: string | null;
    availableTimeFrom?: string;
    availableTimeTo?: string;
}
