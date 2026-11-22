import { SupportTicketEntity, SupportTicketMessageEntity } from "../../domain/entities/support-ticket.entity";
import { TicketResponseDto, TicketMessageResponseDto } from "../../application/dtos/response/ticket-response.dto";

export class SupportTicketMapper {
  static toDomain(record: any, messages: any[] = []): SupportTicketEntity {
    return {
      id: record.id,
      ticketNumber: record.ticket_number,
      creatorId: record.creator_id,
      creatorRole: record.creator_role,
      targetType: record.target_type || "GENERAL",
      targetId: record.target_id ?? null,
      targetNumber: record.target_number ?? null,
      category: record.category,
      categoryLabel: record.category_label,
      subject: record.subject,
      description: record.description,
      metadata: record.metadata ? (typeof record.metadata === "string" ? JSON.parse(record.metadata) : record.metadata) : null,
      priority: record.priority,
      status: record.status,
      resolutionNote: record.resolution_note ?? null,
      settlementDecision: record.settlement_decision ?? null,
      settlementDetails: record.settlement_details ?? null,
      assignedTo: record.assigned_to ?? null,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at),
      messages: messages.map((m) => this.toMessageDomain(m))
    };
  }

  static toMessageDomain(record: any): SupportTicketMessageEntity {
    return {
      id: record.id,
      ticketId: record.ticket_id,
      authorId: record.author_id ?? null,
      authorName: record.author_name,
      authorRole: record.author_role,
      message: record.message,
      createdAt: new Date(record.created_at)
    };
  }

  static toResponseDto(entity: SupportTicketEntity): TicketResponseDto {
    const isBooking = entity.targetType === "BOOKING";
    return {
      id: entity.id,
      ticketNumber: entity.ticketNumber,
      creatorId: entity.creatorId,
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
      priority: entity.priority,
      status: entity.status,
      resolutionNote: entity.resolutionNote,
      settlementDecision: entity.settlementDecision,
      settlementDetails: entity.settlementDetails,
      assignedTo: entity.assignedTo,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      messages: (entity.messages || []).map((m): TicketMessageResponseDto => ({
        id: m.id,
        ticketId: m.ticketId,
        authorId: m.authorId,
        authorName: m.authorName,
        authorRole: m.authorRole,
        message: m.message,
        createdAt: m.createdAt.toISOString()
      }))
    };
  }
}
