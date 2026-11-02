export type RequestUrgency = "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
export type RequestBudgetType = "OPEN_BID" | "FIXED";
export type ServiceRequestStatus = "PENDING" | "ACCEPTED" | "CANCELLED" | "COMPLETED";

export interface CreateServiceRequestPayload {
  categoryId: string;
  subserviceId?: string;
  title: string;
  description: string;
  urgency: RequestUrgency;
  specificDate?: string;
  selectedAddressId: string;
  availableTimeFrom: string;
  availableTimeTo: string;
  budgetType: RequestBudgetType;
  budgetAmount?: string;
  images?: string[];
}

export interface ServiceRequestImageItem {
  id: string;
  service_request_id: string;
  image_key: string;
  display_order: number;
  created_at: string;
}

export interface ServiceRequestItem {
  id: string;
  customer_id: string;
  category_id: string;
  subservice_id?: string | null;
  title: string;
  description: string;
  urgency: RequestUrgency;
  specific_date?: string | null;
  address_id: string;
  available_time_from: string;
  available_time_to: string;
  budget_type: RequestBudgetType;
  budget_amount: number;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at: string;
  images?: ServiceRequestImageItem[];
}

