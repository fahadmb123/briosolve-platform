import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SupportTicket, TicketStatus, TicketPriority, TicketMessage, SettlementReceipt } from "../types/support.types";

interface SupportStoreState {
  tickets: SupportTicket[];
  addTicket: (ticket: SupportTicket) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  updateTicketPriority: (id: string, priority: TicketPriority) => void;
  updateTicketAssignee: (id: string, assignedTo: string) => void;
  resolveTicket: (
    id: string,
    resolutionNote: string,
    settlementDecision?: "FULL_REFUND_CUSTOMER" | "FULL_PAYOUT_PROVIDER" | "SPLIT_SETTLEMENT" | "NO_FINANCIAL_ACTION",
    settlementDetails?: string,
    settlementReceipt?: SettlementReceipt,
    sanctionsApplied?: string[]
  ) => void;
  addTicketMessage: (
    ticketId: string,
    message: string,
    authorName: string,
    authorRole: "CUSTOMER" | "PROVIDER" | "ADMIN" | "SYSTEM"
  ) => void;
}

export const useSupportStore = create<SupportStoreState>()(
  persist(
    (set) => ({
      tickets: [],
      addTicket: (ticket) =>
        set((state) => ({
          tickets: [ticket, ...(state.tickets || [])]
        })),
      updateTicketStatus: (id, status) =>
        set((state) => ({
          tickets: (state.tickets || []).map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
          )
        })),
      updateTicketPriority: (id, priority) =>
        set((state) => ({
          tickets: (state.tickets || []).map((t) =>
            t.id === id ? { ...t, priority, updatedAt: new Date().toISOString() } : t
          )
        })),
      updateTicketAssignee: (id, assignedTo) =>
        set((state) => ({
          tickets: (state.tickets || []).map((t) =>
            t.id === id ? { ...t, assignedTo, updatedAt: new Date().toISOString() } : t
          )
        })),
      resolveTicket: (id, resolutionNote, settlementDecision, settlementDetails, settlementReceipt, sanctionsApplied) =>
        set((state) => ({
          tickets: (state.tickets || []).map((t) => {
            if (t.id !== id) return t;
            const resolutionMsg: TicketMessage = {
              id: `msg-${Date.now()}`,
              authorName: "Support Resolution Team",
              authorRole: "SYSTEM",
              message: `Official Resolution: ${resolutionNote}${settlementDecision ? ` [Settlement: ${settlementDecision.replace(/_/g, " ")}]` : ""}`,
              createdAt: new Date().toISOString()
            };
            return {
              ...t,
              status: "RESOLVED",
              resolutionNote,
              settlementDecision,
              settlementDetails,
              settlementReceipt,
              sanctionsApplied,
              updatedAt: new Date().toISOString(),
              messages: [...(t.messages || []), resolutionMsg]
            };
          })
        })),
      addTicketMessage: (ticketId, message, authorName, authorRole) =>
        set((state) => ({
          tickets: (state.tickets || []).map((t) => {
            if (t.id !== ticketId) return t;
            const newMsg: TicketMessage = {
              id: `msg-${Date.now()}`,
              authorName,
              authorRole,
              message,
              createdAt: new Date().toISOString()
            };
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: [...(t.messages || []), newMsg]
            };
          })
        }))
    }),
    {
      name: "briosolve_support_tickets_v2"
    }
  )
);
