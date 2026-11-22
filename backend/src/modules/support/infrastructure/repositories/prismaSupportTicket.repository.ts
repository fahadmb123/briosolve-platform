import { randomUUID } from "crypto";
import { db } from "../../../../shared/database/client";
import { SupportTicket, SupportTicketMessage, TicketStatus } from "../../domain/entities/support-ticket.entity";
import { ISupportTicketRepository, GetUserTicketsParams, UserTicketsResult, GetAdminTicketsParams, AdminTicketsResult } from "../../domain/repositories/ISupportTicket.repository";
import { CreateTicketRequestDto } from "../../application/dtos/request/create-ticket.dto";
import { SupportTicketMapper } from "../mappers/support-ticket.mapper";

export class PrismaSupportTicketRepository implements ISupportTicketRepository {
  async createTicket(input: CreateTicketRequestDto): Promise<SupportTicket> {
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

    let query = db.orm.public.support_tickets.where({ creator_id: params.userId as never });

    if (params.status && params.status !== "ALL") {
      if (params.status === "ACTIVE") {
        query = query.where((t) => t.status.in(["OPEN", "UNDER_REVIEW"]));
      } else if (params.status === "RESOLVED") {
        query = query.where((t) => t.status.in(["RESOLVED", "CLOSED"]));
      } else {
        query = query.where({ status: params.status as never });
      }
    }

    if (params.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`;
      if (params.search.trim().toUpperCase().startsWith("TK")) {
        query = query.where((t) => t.ticket_number.ilike(term));
      } else {
        query = query.where((t) => t.subject.ilike(term));
      }
    }

    const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
    const total = Number(totalResult?.total || 0);

    const allCounts = await db.orm.public.support_tickets
      .where({ creator_id: params.userId as never })
      .aggregate((agg) => ({ count: agg.count() }));

    const activeCounts = await db.orm.public.support_tickets
      .where({ creator_id: params.userId as never })
      .where((t) => t.status.in(["OPEN", "UNDER_REVIEW"]))
      .aggregate((agg) => ({ count: agg.count() }));

    const resolvedCounts = await db.orm.public.support_tickets
      .where({ creator_id: params.userId as never })
      .where((t) => t.status.in(["RESOLVED", "CLOSED"]))
      .aggregate((agg) => ({ count: agg.count() }));

    const counts = {
      all: Number(allCounts?.count || 0),
      active: Number(activeCounts?.count || 0),
      resolved: Number(resolvedCounts?.count || 0)
    };

    const paged = await query
      .orderBy((t) => t.created_at.desc())
      .offset(skip)
      .limit(limit)
      .all();

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

    let query = db.orm.public.support_tickets;

    if (params.status && params.status !== "ALL") {
      query = query.where({ status: params.status as never });
    }

    if (params.category && params.category.trim()) {
      query = query.where({ category: params.category.trim() as never });
    }

    if (params.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`;
      if (params.search.trim().toUpperCase().startsWith("TK")) {
        query = query.where((t) => t.ticket_number.ilike(term));
      } else {
        query = query.where((t) => t.subject.ilike(term));
      }
    }

    const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
    const total = Number(totalResult?.total || 0);

    const openCountResult = await db.orm.public.support_tickets
      .where({ status: "OPEN" as never })
      .aggregate((agg) => ({ count: agg.count() }));
    const openCount = Number(openCountResult?.count || 0);

    const paged = await query
      .orderBy((t) => t.created_at.desc())
      .offset(skip)
      .limit(limit)
      .all();

    const userIds = [...new Set(paged.map((r: any) => r.creator_id).filter(Boolean))];
    const usersMap = new Map<string, string>();
    for (const uid of userIds) {
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

  async updateTicketStatus(
    ticketId: string,
    data: { status: TicketStatus; resolutionNote?: string | null; assignedTo?: string | null }
  ): Promise<SupportTicket | null> {
    const updateData = SupportTicketMapper.toUpdatePersistence(data);

    await db.orm.public.support_tickets
      .where({ id: ticketId as never })
      .update(updateData as never);

    return this.findById(ticketId);
  }
}
