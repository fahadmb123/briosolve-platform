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
  | "EXPIRED"
  | "CLOSED";

export interface ServiceRequestAnswerItem {
  question_id: string;
  question_label: string;
  answer: string | string[] | boolean | number;
}

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
  budgetType?: RequestBudgetType;
  budgetAmount?: string;
  images: string[];
  answers?: ServiceRequestAnswerItem[] | null;
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
  answers?: ServiceRequestAnswerItem[] | null;
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

export interface ServiceRequestCustomerItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  profile_image?: string | null;
}

export interface ServiceRequestBookingSummary {
  id: string;
  booking_number: string;
  status: string;
  payment_status: string;
  advance_amount: number;
  total_amount: number;
  cancellation_reason?: string | null;
  is_diagnosis_closed?: boolean;
}

export interface CustomerServiceRequestItem {
  id: string;
  customer_id: string;
  category_id: string;
  category_name?: string;
  category_image?: string | null;
  subservice_id?: string | null;
  subservice_name?: string | null;
  subservice_image?: string | null;
  title: string;
  description: string;
  urgency: RequestUrgency;
  specific_date?: string | null;
  address_id: string;
  address_details?: ServiceRequestAddressItem | null;
  customer_details?: ServiceRequestCustomerItem | null;
  distance_km?: number | null;
  available_time_from: string;
  available_time_to: string;
  budget_type?: RequestBudgetType;
  budget_amount?: number | null;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at: string;
  images?: ServiceRequestImageItem[];
  answers?: ServiceRequestAnswerItem[] | null;
  matched_providers_count?: number;
  quotations_count?: number;
  has_quoted?: boolean;
  my_quotation_status?: string | null;
  my_quotation_id?: string | null;
  latest_booking?: ServiceRequestBookingSummary | null;
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
  budget_type?: RequestBudgetType;
  budget_amount?: number | null;
  status: ServiceRequestStatus;
  created_at: string;
  updated_at: string;
  images?: ServiceRequestImageItem[];
  answers?: ServiceRequestAnswerItem[] | null;
}
