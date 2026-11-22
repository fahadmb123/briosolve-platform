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
  authorName?: string;
}

export interface GetSupportTicketsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetAdminSupportTicketsParams {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserTicketsData {
  tickets: SupportTicket[];
  total: number;
  counts: {
    all: number;
    active: number;
    resolved: number;
  };
}

export interface AdminTicketsData {
  tickets: SupportTicket[];
  total: number;
  openCount: number;
}

export const createSupportTicketApi = async (payload: CreateTicketPayload): Promise<response<SupportTicket>> => {
  const res = await apiClient.post<response<SupportTicket>>("/api/support/tickets", payload);
  return res.data;
};

export const getMySupportTicketsApi = async (params?: GetSupportTicketsParams): Promise<response<UserTicketsData>> => {
  const res = await apiClient.get<response<UserTicketsData>>("/api/support/tickets/my", { params });
  return res.data;
};

export const getAdminSupportTicketsApi = async (
  params?: GetAdminSupportTicketsParams
): Promise<response<AdminTicketsData>> => {
  const res = await apiClient.get<response<AdminTicketsData>>("/api/support/tickets/admin", { params });
  return res.data;
};

export interface UpdateTicketStatusPayload {
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
  resolutionNote?: string | null;
}

export const updateTicketStatusApi = async (
  ticketId: string,
  payload: UpdateTicketStatusPayload
): Promise<response<SupportTicket>> => {
  const res = await apiClient.patch<response<SupportTicket>>(`/api/support/tickets/${ticketId}/status`, payload);
  return res.data;
};
