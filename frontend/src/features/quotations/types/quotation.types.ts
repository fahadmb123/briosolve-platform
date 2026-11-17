export type QuotationType = "FIXED" | "ESTIMATED" | "INSPECTION_REQUIRED";

export type QuotationValidity = "24_HOURS" | "48_HOURS" | "3_DAYS" | "7_DAYS";

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
  messageToCustomer?: string;
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
  messageToCustomer?: string;
  validUntil: string;
  extraChargePolicy: string;
}
