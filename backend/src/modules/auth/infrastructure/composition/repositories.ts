import { PrismaUserRepository } from "../repositories/prismaUser.repository";
import { PrismaCustomerRepository } from "../repositories/prismaCustomer.repository";
import { PrismaRefreshSessionRepository } from "../repositories/prismaRefreshSession.repository";

export const userRepository = new PrismaUserRepository();
export const customerRepository = new PrismaCustomerRepository();
export const refreshSessionRepository = new PrismaRefreshSessionRepository();
