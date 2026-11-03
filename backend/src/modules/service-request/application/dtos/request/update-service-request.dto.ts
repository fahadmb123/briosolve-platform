export interface UpdateServiceRequestDto {
    id: string;
    customerId: string;
    title?: string;
    description?: string;
    categoryId?: string;
    subserviceId?: string | null;
    urgency?: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
    specificDate?: Date | string | null;
    selectedAddressId?: string;
    availableTimeFrom?: string;
    availableTimeTo?: string;
    budgetType?: "OPEN_BID" | "FIXED";
    budgetAmount?: number | null;
    imageUrls?: string[];
}

export interface UpdateServiceRequestRepoDto {
    title?: string;
    description?: string;
    categoryId?: string;
    subserviceId?: string | null;
    urgency?: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
    specificDate?: Date | string | null;
    selectedAddressId?: string;
    availableTimeFrom?: string;
    availableTimeTo?: string;
    budgetType?: "OPEN_BID" | "FIXED";
    budgetAmount?: number | null;
    imageUrls?: string[];
}

