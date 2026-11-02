export interface ServiceRequestImage {
    id: string;
    service_request_id: string;
    image_key: string;
    display_order: number;
    created_at: Date;
}

export class ServiceRequest {
    constructor(
        public readonly id: string,
        public readonly customer_id: string,
        public readonly category_id: string,
        public readonly subservice_id: string | null,
        public readonly title: string,
        public readonly description: string,
        public readonly urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE",
        public readonly specific_date: Date | null,
        public readonly address_id: string,
        public readonly available_time_from: string,
        public readonly available_time_to: string,
        public readonly budget_type: "OPEN_BID" | "FIXED",
        public readonly budget_amount: number | null,
        public readonly status: "PENDING" | "ACCEPTED" | "CANCELLED" | "COMPLETED",
        public readonly created_at: Date,
        public readonly updated_at: Date,
        public readonly images?: ServiceRequestImage[]
    ) {}
}

