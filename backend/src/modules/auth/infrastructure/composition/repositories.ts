import { PrismaUserRepository } from "../repositories/prismaUser.repository.js";
import { PrismaCustomerRepository } from "../repositories/prismaCustomer.repository.js";

export const userRepository = new PrismaUserRepository();
export const customerRepository = new PrismaCustomerRepository();
