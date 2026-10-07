import { AddressRepository } from "../repositories/prismaAddress.repository.js";
import { CustomerRepository } from "../repositories/prismaCustomer.repository.js";
import { UserRepository } from "../repositories/prismaUser.repository.js";

export const userRepository = new UserRepository();
export const customerRepository = new CustomerRepository();
export const addressRepository = new AddressRepository()