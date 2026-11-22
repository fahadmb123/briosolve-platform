import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type { SupportTicket } from "../types/support.types";

export interface CreateTicketPayload {
  targetType?: string;
  targetId?: string;
  targetNumber?: string;
  bookingId?: string;
  bookingNumber?: string;
  serviceTitle?: string;
  category: string;
  categoryLabel: string;
  subject: string;
  description: string;
  metadata?: Record<string, any>;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  authorName?: string;
}

export const createSupportTicketApi = async (payload: CreateTicketPayload): Promise<response<SupportTicket>> => {
  const res = await apiClient.post<response<SupportTicket>>("/api/support/tickets", payload);
  return res.data;
};

export const getMySupportTicketsApi = async (): Promise<response<SupportTicket[]>> => {
  const res = await apiClient.get<response<SupportTicket[]>>("/api/support/tickets/my");
  return res.data;
};
