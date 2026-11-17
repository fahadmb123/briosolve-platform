export type QuotationType = "FIXED" | "ESTIMATED" | "INSPECTION_REQUIRED";

export type QuotationValidity = "24_HOURS" | "48_HOURS" | "3_DAYS" | "7_DAYS";

export type QuotationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "WITHDRAWN";

export interface QuotationFormData {
  amount: number | "";
  quotationType: QuotationType;
  workDescription: string;
  includedItems: string[];
  excludedItems: string[];
  estimatedDuration: string;
  availableDateTime: string;
  validUntil: QuotationValidity | string;
  extraChargePolicy: string;
}

export interface SubmitQuotationPayload {
  serviceRequestId: string;
  amount: number;
  quotationType: QuotationType;
  workDescription: string;
  includedItems: string[];
  excludedItems: string[];
  estimatedDuration?: string;
  availableDateTime?: string;
  validUntil: string;
  extraChargePolicy: string;
}

export interface UpdateQuotationPayload {
  id: string;
  amount: number;
  quotationType: QuotationType;
  workDescription: string;
  includedItems: string[];
  excludedItems: string[];
  estimatedDuration?: string;
  availableDateTime?: string;
  validUntil: string;
  extraChargePolicy: string;
}

export interface ProviderQuotationItem {
  id: string;
  serviceRequestId: string;
  serviceRequestTitle?: string | null;
  categoryName?: string | null;
  amount: number;
  quotationType: QuotationType;
  workDescription: string;
  includedItems: string[];
  excludedItems: string[];
  estimatedDuration: string | null;
  availableDateTime: string | null;
  validUntil: string;
  validUntilDate: string;
  extraChargePolicy: string;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RequestQuotationProvider {
  id: string;
  userId: string;
  name: string;
  businessName: string;
  profileImage: string | null;
  experience: string;
  completedJobs: number;
  phone: string | null;
  email: string | null;
}

export interface RequestQuotationItem {
  id: string;
  serviceRequestId: string;
  providerId: string;
  provider: RequestQuotationProvider;
  amount: number;
  quotationType: QuotationType;
  workDescription: string;
  includedItems: string[];
  excludedItems: string[];
  estimatedDuration: string | null;
  availableDateTime: string | null;
  validUntil: string;
  validUntilDate: string;
  extraChargePolicy: string;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RequestQuotationsResponse {
  quotations: RequestQuotationItem[];
  total: number;
  acceptedQuotationId: string | null;
}

export interface GetMyQuotationsParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: "NEWEST" | "OLDEST";
}

export interface GetMyQuotationsResponse {
  quotations: ProviderQuotationItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  counts: Record<string, number>;
}
