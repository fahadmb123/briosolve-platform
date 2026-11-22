export type TicketStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
export type TicketCreatorRole = "CUSTOMER" | "PROVIDER";

export class SupportTicketMessage {
  constructor(
    public readonly id: string,
    public readonly ticketId: string,
    public readonly authorId: string | null,
    public readonly authorName: string,
    public readonly authorRole: string,
    public readonly message: string,
    public readonly createdAt: Date
  ) {}
}

export class SupportTicket {
  constructor(
    public readonly id: string,
    public readonly ticketNumber: string,
    public readonly creatorId: string,
    public readonly creatorRole: TicketCreatorRole,
    public readonly targetType: string,
    public readonly targetId: string | null,
    public readonly targetNumber: string | null,
    public readonly category: string,
    public readonly categoryLabel: string,
    public readonly subject: string,
    public readonly description: string,
    public readonly metadata: Record<string, any> | null,
    public readonly status: TicketStatus,
    public readonly resolutionNote: string | null,
    public readonly settlementDecision: string | null,
    public readonly settlementDetails: string | null,
    public readonly assignedTo: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly messages: SupportTicketMessage[] = [],
    public readonly creatorName?: string | null,
    public readonly creatorEmail?: string | null
  ) {}
}
