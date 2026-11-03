export type RequestUrgency = "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
export type RequestBudgetType = "OPEN_BID" | "FIXED";
export type ServiceRequestStatus =
  | "DRAFT"
  | "PENDING"
  | "ACTIVE"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

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
  images: string[];
}

export interface UpdateServiceRequestPayload {
  categoryId?: string;
  subserviceId?: string | null;
  title?: string;
  description?: string;
  urgency?: RequestUrgency;
  specificDate?: string | null;
  selectedAddressId?: string;
  availableTimeFrom?: string;
  availableTimeTo?: string;
  budgetType?: RequestBudgetType;
  budgetAmount?: string | null;
  images?: string[];
}

export interface ServiceRequestImageItem {
  id: string;
  service_request_id: string;
  image_key: string;
  display_order: number;
  created_at: string;
}

export interface ServiceRequestAddressItem {
  id: string;
  house_no?: string | null;
  area: string;
  city: string;
  district?: string | null;
  state: string;
  pincode: string;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface CustomerServiceRequestItem {
  id: string;
  customer_id: string;
  category_id: string;
  category_name?: string;
  subservice_id?: string | null;
  subservice_name?: string | null;
  title: string;
  description: string;
  urgency: RequestUrgency;
  specific_date?: string | null;
  address_id: string;
  address_details?: ServiceRequestAddressItem | null;
  available_time_from: string;
  available_time_to: string;
  budget_type: RequestBudgetType;
  budget_amount: number | null;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at: string;
  images?: ServiceRequestImageItem[];
  matched_providers_count?: number;
  quotations_count?: number;
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
