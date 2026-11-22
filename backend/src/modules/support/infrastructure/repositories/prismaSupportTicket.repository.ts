import { randomUUID } from "crypto";
import { db } from "../../../../shared/database/client";
import { SupportTicketEntity, SupportTicketMessageEntity } from "../../domain/entities/support-ticket.entity";
import { ISupportTicketRepository, CreateTicketParams } from "../../domain/repositories/ISupportTicket.repository";
import { SupportTicketMapper } from "../mappers/support-ticket.mapper";

export class PrismaSupportTicketRepository implements ISupportTicketRepository {
  async createTicket(params: CreateTicketParams, initialMessageAuthorName: string): Promise<SupportTicketEntity> {
    const ticketId = randomUUID();
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `TK-${year}-${randomSuffix}`;

    const created = await db.orm.public.support_tickets.create({
      id: ticketId as never,
      ticket_number: ticketNumber as never,
      creator_id: params.creatorId as never,
      creator_role: params.creatorRole as never,
      target_type: (params.targetType || "GENERAL") as never,
      target_id: (params.targetId ?? null) as never,
      target_number: (params.targetNumber ?? null) as never,
      category: params.category as never,
      category_label: params.categoryLabel as never,
      subject: params.subject as never,
      description: params.description as never,
      metadata: (params.metadata ? JSON.stringify(params.metadata) : null) as never,
      priority: (params.priority ?? "HIGH") as never,
      status: "OPEN" as never
    } as never);

    const messageId = randomUUID();
    const messageRecord = await db.orm.public.support_ticket_messages.create({
      id: messageId as never,
      ticket_id: ticketId as never,
      author_id: params.creatorId as never,
      author_name: initialMessageAuthorName as never,
      author_role: params.creatorRole as never,
      message: params.description as never
    } as never);

    return SupportTicketMapper.toDomain(created, [messageRecord]);
  }

  async findById(id: string): Promise<SupportTicketEntity | null> {
    const record = await db.orm.public.support_tickets
      .where({ id: id as never })
      .first();

    if (!record) return null;

    const messages = await db.orm.public.support_ticket_messages
      .where({ ticket_id: id as never })
      .orderBy((m) => m.created_at.asc())
      .all();

    return SupportTicketMapper.toDomain(record, messages);
  }

  async findByCreatorId(creatorId: string): Promise<SupportTicketEntity[]> {
    const records = await db.orm.public.support_tickets
      .where({ creator_id: creatorId as never })
      .orderBy((t) => t.created_at.desc())
      .all();

    const tickets: SupportTicketEntity[] = [];
    for (const r of records) {
      const messages = await db.orm.public.support_ticket_messages
        .where({ ticket_id: r.id as never })
        .orderBy((m) => m.created_at.asc())
        .all();
      tickets.push(SupportTicketMapper.toDomain(r, messages));
    }

    return tickets;
  }

  async getAll(status?: string): Promise<SupportTicketEntity[]> {
    let query = db.orm.public.support_tickets;
    const records = status
      ? await query.where({ status: status as never }).orderBy((t) => t.created_at.desc()).all()
      : await query.orderBy((t) => t.created_at.desc()).all();

    const tickets: SupportTicketEntity[] = [];
    for (const r of records) {
      const messages = await db.orm.public.support_ticket_messages
        .where({ ticket_id: r.id as never })
        .orderBy((m) => m.created_at.asc())
        .all();
      tickets.push(SupportTicketMapper.toDomain(r, messages));
    }

    return tickets;
  }

  async addMessage(
    ticketId: string,
    authorId: string | null,
    authorName: string,
    authorRole: string,
    message: string
  ): Promise<SupportTicketMessageEntity> {
    const messageId = randomUUID();
    const created = await db.orm.public.support_ticket_messages.create({
      id: messageId as never,
      ticket_id: ticketId as never,
      author_id: (authorId ?? null) as never,
      author_name: authorName as never,
      author_role: authorRole as never,
      message: message as never
    } as never);

    return SupportTicketMapper.toMessageDomain(created);
  }
}
