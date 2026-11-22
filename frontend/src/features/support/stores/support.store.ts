import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SupportTicket, TicketStatus, TicketMessage } from "../types/support.types";

interface SupportStoreState {
  tickets: SupportTicket[];
  addTicket: (ticket: SupportTicket) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  resolveTicket: (
    id: string,
    resolutionNote: string,
    settlementDecision?: "FULL_REFUND_CUSTOMER" | "FULL_PAYOUT_PROVIDER" | "SPLIT_SETTLEMENT" | "NO_FINANCIAL_ACTION",
    settlementDetails?: string
  ) => void;
  addTicketMessage: (
    ticketId: string,
    message: string,
    authorName: string,
    authorRole: "CUSTOMER" | "PROVIDER" | "ADMIN" | "SYSTEM"
  ) => void;
}

const INITIAL_MOCK_TICKETS: SupportTicket[] = [
  {
    id: "tk-9041",
    ticketNumber: "TK-2026-9041",
    creatorId: "user-1",
    creatorName: "Fahad",
    creatorRole: "CUSTOMER",
    bookingId: "b64daea7-1e40-413a-a36e-51be0568bffe",
    bookingNumber: "BK-MWQGDQBP-9950",
    serviceTitle: "AC Repair & Check Cooling",
    counterpartyName: "Basheer M B (Apex Electrician)",
    category: "PAYMENT_REFUND",
    categoryLabel: "Payment & Escrow Discrepancy",
    subject: "Remaining balance and platform fee clarification",
    description: "I noticed the platform fee breakdown calculation on the balance settlement needed review. I wanted to verify the exact wallet credit.",
    priority: "MEDIUM",
    status: "RESOLVED",
    attachments: [],
    createdAt: "2026-11-21T18:30:00.000Z",
    updatedAt: "2026-11-21T19:00:00.000Z",
    resolutionNote: "Escrow breakdown reviewed. Provider payout is verified net of the 5% platform fee with full wallet credit.",
    settlementDecision: "FULL_PAYOUT_PROVIDER",
    settlementDetails: "Net earnings released to provider wallet.",
    messages: [
      {
        id: "m-1",
        authorName: "Support Agent",
        authorRole: "ADMIN",
        message: "Hello! We reviewed the case. The 5% fee is calculated on base service value, and net earnings are credited upon customer settlement.",
        createdAt: "2026-11-21T18:45:00.000Z"
      }
    ]
  },
  {
    id: "tk-9042",
    ticketNumber: "TK-2026-9042",
    creatorId: "user-2",
    creatorName: "Rahul Sharma",
    creatorRole: "CUSTOMER",
    bookingId: "b64daea7-1e40-413a-a36e-51be0568bffa",
    bookingNumber: "BK-MWQGDQBP-9951",
    serviceTitle: "Custom Wooden Partitions",
    counterpartyName: "Apex Carpentry Ltd",
    category: "PROVIDER_NO_SHOW",
    categoryLabel: "Provider No-Show",
    subject: "Technician did not arrive for scheduled appointment",
    description: "The provider confirmed arrival for 10:00 AM but did not show up. Multiple calls went unanswered and no alternate technician was dispatched.",
    priority: "URGENT",
    status: "OPEN",
    attachments: [],
    createdAt: "2026-11-22T08:15:00.000Z",
    updatedAt: "2026-11-22T08:15:00.000Z",
    messages: [
      {
        id: "m-2",
        authorName: "Rahul Sharma",
        authorRole: "CUSTOMER",
        message: "The provider confirmed arrival for 10:00 AM but did not show up. Multiple calls went unanswered.",
        createdAt: "2026-11-22T08:15:00.000Z"
      }
    ]
  },
  {
    id: "tk-9043",
    ticketNumber: "TK-2026-9043",
    creatorId: "prov-1",
    creatorName: "Basheer M B",
    creatorRole: "PROVIDER",
    bookingId: "b64daea7-1e40-413a-a36e-51be0568bffb",
    bookingNumber: "BK-MWQGDQBP-9952",
    serviceTitle: "Full House Wiring Inspection",
    counterpartyName: "Anita Roy",
    category: "CUSTOMER_ABSENT",
    categoryLabel: "Customer Absent / Unreachable",
    subject: "Premises locked upon arrival at site",
    description: "I arrived at the location at 11:30 AM as scheduled. The premises were locked and customer did not answer my calls after waiting for 35 minutes.",
    priority: "HIGH",
    status: "UNDER_REVIEW",
    attachments: [],
    createdAt: "2026-11-22T11:45:00.000Z",
    updatedAt: "2026-11-22T12:00:00.000Z",
    messages: [
      {
        id: "m-3",
        authorName: "Basheer M B",
        authorRole: "PROVIDER",
        message: "I waited 35 minutes outside the apartment gate. Took photos of premises door and sent WhatsApp ping.",
        createdAt: "2026-11-22T11:45:00.000Z"
      },
      {
        id: "m-4",
        authorName: "Support Agent",
        authorRole: "ADMIN",
        message: "Investigation started. We have requested customer response within 4 hours before processing travel fee claim.",
        createdAt: "2026-11-22T12:00:00.000Z"
      }
    ]
  }
];

export const useSupportStore = create<SupportStoreState>()(
  persist(
    (set) => ({
      tickets: INITIAL_MOCK_TICKETS,
      addTicket: (ticket) =>
        set((state) => ({
          tickets: [ticket, ...state.tickets]
        })),
      updateTicketStatus: (id, status) =>
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
          )
        })),
      resolveTicket: (id, resolutionNote, settlementDecision, settlementDetails) =>
        set((state) => ({
          tickets: state.tickets.map((t) => {
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
              updatedAt: new Date().toISOString(),
              messages: [...t.messages, resolutionMsg]
            };
          })
        })),
      addTicketMessage: (ticketId, message, authorName, authorRole) =>
        set((state) => ({
          tickets: state.tickets.map((t) => {
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
              messages: [...t.messages, newMsg]
            };
          })
        }))
    }),
    {
      name: "briosolve_support_tickets_v1"
    }
  )
);
