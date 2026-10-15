import { AddressRepository } from "../repositories/prismaAddress.repository";
import { CustomerRepository } from "../repositories/prismaCustomer.repository";
import { UserRepository } from "../repositories/prismaUser.repository";
import { ProviderRepository } from "../repositories/prismaProvider.repository";
import { ProviderAvailabilityRepository } from "../repositories/prismaProviderAvailability.repository";
import { UserAccountBlockRepository } from "../repositories/prismaUserAccountBlock.repository";
import { AccountReactivationRequestRepository } from "../repositories/prismaAccountReactivationRequest.repository";

export const userRepository = new UserRepository();
export const customerRepository = new CustomerRepository();
export const addressRepository = new AddressRepository();
export const providerRepository = new ProviderRepository();
export const providerAvailabilityRepository = new ProviderAvailabilityRepository();
export const userAccountBlockRepository = new UserAccountBlockRepository();
export const accountReactivationRequestRepository = new AccountReactivationRequestRepository();