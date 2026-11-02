export interface CreateServiceRequestInputDto {
    customerId: string;
    categoryId: string;
    subserviceId: string;
    title: string;
    description: string;
    urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
    specificDate?: string | null;
    selectedAddressId: string;
    availableTimeFrom: string;
    availableTimeTo: string;
    budgetType: "OPEN_BID" | "FIXED";
    budgetAmount?: string | null;
    images: string[];
}

export interface CreateServiceRequestRepoDto {
    customerId: string;
    categoryId: string;
    subserviceId: string;
    title: string;
    description: string;
    urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
    specificDate?: string | null;
    selectedAddressId: string;
    availableTimeFrom: string;
    availableTimeTo: string;
    budgetType: "OPEN_BID" | "FIXED";
    budgetAmount?: string | null;
    imageUrls: string[];
}
