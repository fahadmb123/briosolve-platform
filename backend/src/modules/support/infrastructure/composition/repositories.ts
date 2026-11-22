import { PrismaSupportTicketRepository } from "../repositories/prismaSupportTicket.repository";
import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";

export function createSupportTicketRepository(): ISupportTicketRepository {
  return new PrismaSupportTicketRepository();
}
