import { PrismaUserRepository } from "../repositories/prismaUser.repository";
import { PrismaCustomerRepository } from "../repositories/prismaCustomer.repository";

export const userRepository = new PrismaUserRepository();
export const customerRepository = new PrismaCustomerRepository();
