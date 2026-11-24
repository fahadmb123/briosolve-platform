import { Temporal } from "@js-temporal/polyfill";
import { SupportTicket, SupportTicketMessage, TicketStatus, TicketCreatorRole } from "../../domain/entities/support-ticket.entity";
import { CreateTicketRequestDto } from "../dtos/request/create-ticket.dto";
import { TicketResponseDto, TicketMessageResponseDto } from "../dtos/response/ticket-response.dto";

export class SupportTicketMapper {
  private static parseDate(val: any): Date {
    if (!val) return new Date();
    if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
      const epoch = (val as { epochMilliseconds: bigint | number }).epochMilliseconds;
      return new Date(Number(epoch));
    }
    return new Date(val);
  }

  static toDomain(
    record: any,
    messages: any[] = [],
    creatorName?: string | null,
    creatorEmail?: string | null
  ): SupportTicket {
    let parsedMetadata: Record<string, any> | null = null;
    if (record.metadata) {
      parsedMetadata = typeof record.metadata === "string" ? JSON.parse(record.metadata) : record.metadata;
    }

    return new SupportTicket(
      record.id,
      record.ticket_number,
      record.creator_id,
      record.creator_role as TicketCreatorRole,
      record.target_type || "GENERAL",
      record.target_id ?? null,
      record.target_number ?? null,
      record.category,
      record.category_label,
      record.subject,
      record.description,
      parsedMetadata,
      record.status as TicketStatus,
      record.resolution_note ?? null,
      record.settlement_decision ?? null,
      record.settlement_details ?? null,
      record.assigned_to ?? null,
      this.parseDate(record.created_at),
      this.parseDate(record.updated_at),
      messages.map((m) => this.toMessageDomain(m)),
      creatorName,
      creatorEmail
    );
  }

  static toMessageDomain(record: any): SupportTicketMessage {
    return new SupportTicketMessage(
      record.id,
      record.ticket_id,
      record.author_id ?? null,
      record.author_name,
      record.author_role,
      record.message,
      this.parseDate(record.created_at)
    );
  }

  static toPersistence(id: string, ticketNumber: string, input: CreateTicketRequestDto) {
    return {
      id: id as never,
      ticket_number: ticketNumber as never,
      creator_id: input.creatorId as never,
      creator_role: input.creatorRole as never,
      target_type: (input.targetType || "GENERAL") as never,
      target_id: (input.targetId ?? null) as never,
      target_number: (input.targetNumber ?? null) as never,
      category: input.category as never,
      category_label: input.categoryLabel as never,
      subject: input.subject.trim() as never,
      description: input.description.trim() as never,
      metadata: (input.metadata ? JSON.stringify(input.metadata) : null) as never,
      priority: "HIGH" as never,
      status: "OPEN" as never
    };
  }

  static toMessagePersistence(id: string, ticketId: string, input: CreateTicketRequestDto) {
    return {
      id: id as never,
      ticket_id: ticketId as never,
      author_id: input.creatorId as never,
      author_name: input.authorName as never,
      author_role: input.creatorRole as never,
      message: input.description.trim() as never
    };
  }

  static toUpdatePersistence(data: { status: TicketStatus; resolutionNote?: string | null; assignedTo?: string | null }): Record<string, unknown> {
    const updatePayload: Record<string, unknown> = {
      status: data.status as never,
      updated_at: Temporal.Now.instant() as never
    };

    if (data.resolutionNote !== undefined) {
      updatePayload.resolution_note = (data.resolutionNote ?? null) as never;
    }

    if (data.assignedTo !== undefined) {
      updatePayload.assigned_to = (data.assignedTo ?? null) as never;
    }

    return updatePayload;
  }

  static toDto(entity: SupportTicket): TicketResponseDto {
    const isBooking = entity.targetType === "BOOKING";
    return {
      id: entity.id,
      ticketNumber: entity.ticketNumber,
      creatorId: entity.creatorId,
      creatorName: entity.creatorName || (entity.creatorRole === "PROVIDER" ? "Service Provider" : "Customer"),
      creatorEmail: entity.creatorEmail ?? null,
      creatorRole: entity.creatorRole,
      targetType: entity.targetType,
      targetId: entity.targetId,
      targetNumber: entity.targetNumber,
      bookingNumber: isBooking ? entity.targetNumber : undefined,
      serviceTitle: entity.metadata?.serviceTitle,
      category: entity.category,
      categoryLabel: entity.categoryLabel,
      subject: entity.subject,
      description: entity.description,
      metadata: entity.metadata,
      status: entity.status,
      resolutionNote: entity.resolutionNote,
      settlementDecision: entity.settlementDecision,
      settlementDetails: entity.settlementDetails,
      assignedTo: entity.assignedTo,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      messages: entity.messages.map((m) => this.toMessageDto(m))
    };
  }

  static toMessageDto(message: SupportTicketMessage): TicketMessageResponseDto {
    return {
      id: message.id,
      ticketId: message.ticketId,
      authorId: message.authorId,
      authorName: message.authorName,
      authorRole: message.authorRole,
      message: message.message,
      createdAt: message.createdAt.toISOString()
    };
  }
}
