export type BookingStatus = "CONFIRMED" | "EN_ROUTE" | "INSPECTION" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export class Booking {
    constructor(
        public readonly id: string,
        public readonly booking_number: string,
        public readonly service_request_id: string,
        public readonly quotation_id: string,
        public readonly customer_id: string,
        public readonly provider_id: string,
        public readonly total_amount: number,
        public readonly platform_fee: number,
        public readonly status: BookingStatus,
        public readonly scheduled_date: Date | null,
        public readonly scheduled_time: string | null,
        public readonly payment_id: string | null,
        public readonly order_id: string | null,
        public readonly notes: string | null,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) {}
}
