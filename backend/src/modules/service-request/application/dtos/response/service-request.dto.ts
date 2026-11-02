import { ServiceRequestImage } from "../../../domain/entities/serviceRequest.entity";

export interface ServiceRequestResponseDto {
    id: string;
    customer_id: string;
    category_id: string;
    subservice_id: string | null;
    title: string;
    description: string;
    urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
    specific_date: Date | null;
    address_id: string;
    available_time_from: string;
    available_time_to: string;
    budget_type: "OPEN_BID" | "FIXED";
    budget_amount: number | null;
    status: "PENDING" | "ACTIVE" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "EXPIRED";
    created_at: Date;
    updated_at: Date;
    images?: ServiceRequestImage[];
}
