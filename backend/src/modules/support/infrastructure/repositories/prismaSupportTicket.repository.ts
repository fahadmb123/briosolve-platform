import { randomUUID } from "crypto";
import { db } from "../../../../shared/database/client";
import { SupportTicket, SupportTicketMessage } from "../../domain/entities/support-ticket.entity";
import { ISupportTicketRepository, GetUserTicketsParams, UserTicketsResult, GetAdminTicketsParams, AdminTicketsResult } from "../../domain/repositories/ISupportTicket.repository";
import { CreateTicketInputDto } from "../../application/dtos/request/create-ticket.dto";
import { SupportTicketMapper } from "../mappers/support-ticket.mapper";

export class PrismaSupportTicketRepository implements ISupportTicketRepository {
  async createTicket(input: CreateTicketInputDto): Promise<SupportTicket> {
    const ticketId = randomUUID();
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `TK-${year}-${randomSuffix}`;

    const ticketData = SupportTicketMapper.toPersistence(ticketId, ticketNumber, input);
    const createdRecord = await db.orm.public.support_tickets.create(ticketData as never);

    const messageData = SupportTicketMapper.toMessagePersistence(randomUUID(), ticketId, input);
    const messageRecord = await db.orm.public.support_ticket_messages.create(messageData as never);

    return SupportTicketMapper.toDomain(createdRecord, [messageRecord]);
  }

  async findById(id: string): Promise<SupportTicket | null> {
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

  async findByCreatorId(params: GetUserTicketsParams): Promise<UserTicketsResult> {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const allRecords = await db.orm.public.support_tickets
      .where({ creator_id: params.userId as never })
      .orderBy((t) => t.created_at.desc())
      .all();

    const counts = {
      all: allRecords.length,
      active: allRecords.filter((t: any) => t.status === "OPEN" || t.status === "UNDER_REVIEW").length,
      resolved: allRecords.filter((t: any) => t.status === "RESOLVED" || t.status === "CLOSED").length
    };

    let filtered = allRecords;

    if (params.status && params.status !== "ALL") {
      if (params.status === "ACTIVE") {
        filtered = filtered.filter((t: any) => t.status === "OPEN" || t.status === "UNDER_REVIEW");
      } else if (params.status === "RESOLVED") {
        filtered = filtered.filter((t: any) => t.status === "RESOLVED" || t.status === "CLOSED");
      } else {
        filtered = filtered.filter((t: any) => t.status === params.status);
      }
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter((t: any) => {
        return (
          (t.ticket_number && t.ticket_number.toLowerCase().includes(q)) ||
          (t.subject && t.subject.toLowerCase().includes(q)) ||
          (t.target_number && t.target_number.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
        );
      });
    }

    const total = filtered.length;
    const paged = filtered.slice(skip, skip + limit);

    const tickets: SupportTicket[] = [];
    for (const r of paged) {
      const messages = await db.orm.public.support_ticket_messages
        .where({ ticket_id: r.id as never })
        .orderBy((m) => m.created_at.asc())
        .all();
      tickets.push(SupportTicketMapper.toDomain(r, messages));
    }

    return { tickets, total, counts };
  }

  async findAdminTickets(params: GetAdminTicketsParams): Promise<AdminTicketsResult> {
    const page = params.page || 1;
    const limit = params.limit || 50;
    const skip = (page - 1) * limit;

    const allRecords = await db.orm.public.support_tickets
      .orderBy((t) => t.created_at.desc())
      .all();

    const openCount = allRecords.filter((t: any) => t.status === "OPEN").length;

    let filtered = allRecords;

    if (params.status && params.status !== "ALL") {
      filtered = filtered.filter((t: any) => t.status === params.status);
    }

    if (params.category && params.category.trim()) {
      filtered = filtered.filter((t: any) => t.category === params.category);
    }

    if (params.priority && params.priority.trim()) {
      filtered = filtered.filter((t: any) => t.priority === params.priority);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter((t: any) => {
        return (
          (t.ticket_number && t.ticket_number.toLowerCase().includes(q)) ||
          (t.subject && t.subject.toLowerCase().includes(q)) ||
          (t.target_number && t.target_number.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
        );
      });
    }

    const total = filtered.length;
    const paged = filtered.slice(skip, skip + limit);

    const userIds = [...new Set(paged.map((r: any) => r.creator_id))];
    const usersMap = new Map<string, string>();
    for (const uid of userIds) {
      if (!uid) continue;
      try {
        const u = await db.orm.public.users.where({ id: uid as never }).first();
        if (u) {
          usersMap.set(uid, (u as any).name || (u as any).email || "User");
        }
      } catch {
        usersMap.set(uid, "User");
      }
    }

    const tickets: SupportTicket[] = [];
    for (const r of paged) {
      const messages = await db.orm.public.support_ticket_messages
        .where({ ticket_id: r.id as never })
        .orderBy((m) => m.created_at.asc())
        .all();
      const creatorName = usersMap.get(r.creator_id) || null;
      tickets.push(SupportTicketMapper.toDomain(r, messages, creatorName));
    }

    return { tickets, total, openCount };
  }

  async getAll(status?: string): Promise<SupportTicket[]> {
    let query = db.orm.public.support_tickets;
    const records = status
      ? await query.where({ status: status as never }).orderBy((t) => t.created_at.desc()).all()
      : await query.orderBy((t) => t.created_at.desc()).all();

    const tickets: SupportTicket[] = [];
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
  ): Promise<SupportTicketMessage> {
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
