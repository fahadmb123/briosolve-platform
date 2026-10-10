import { AddressRepository } from "../repositories/prismaAddress.repository.js";
import { CustomerRepository } from "../repositories/prismaCustomer.repository.js";
import { UserRepository } from "../repositories/prismaUser.repository.js";
import { PrismaProviderRepository } from "../repositories/prismaProvider.repository.js";

export const userRepository = new UserRepository();
export const customerRepository = new CustomerRepository();
export const addressRepository = new AddressRepository();
export const providerRepository = new PrismaProviderRepository();