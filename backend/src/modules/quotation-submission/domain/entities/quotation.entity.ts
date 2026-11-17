export type QuotationType = "FIXED" | "ESTIMATED" | "INSPECTION_REQUIRED";
export type QuotationValidity = "HOURS_24" | "HOURS_48" | "DAYS_3" | "DAYS_7";
export type QuotationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "WITHDRAWN";

export class Quotation {
    constructor(
        public readonly id: string,
        public readonly service_request_id: string,
        public readonly provider_id: string,
        public readonly amount: number,
        public readonly quotation_type: QuotationType,
        public readonly work_description: string,
        public readonly included_items: string[],
        public readonly excluded_items: string[],
        public readonly estimated_duration: string | null,
        public readonly available_date_time: string | null,
        public readonly valid_until: QuotationValidity,
        public readonly valid_until_date: Date,
        public readonly extra_charge_policy: string,
        public readonly status: QuotationStatus,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) {}
}
