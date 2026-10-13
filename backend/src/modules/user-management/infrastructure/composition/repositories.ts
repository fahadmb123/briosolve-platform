import { AddressRepository } from "../repositories/prismaAddress.repository.js";
import { CustomerRepository } from "../repositories/prismaCustomer.repository.js";
import { UserRepository } from "../repositories/prismaUser.repository.js";
import { ProviderRepository } from "../repositories/prismaProvider.repository.js";
import { ProviderAvailabilityRepository } from "../repositories/prismaProviderAvailability.repository.js";
import { UserAccountBlockRepository } from "../repositories/prismaUserAccountBlock.repository.js";
import { AccountReactivationRequestRepository } from "../repositories/prismaAccountReactivationRequest.repository.js";

export const userRepository = new UserRepository();
export const customerRepository = new CustomerRepository();
export const addressRepository = new AddressRepository();
export const providerRepository = new ProviderRepository();
export const providerAvailabilityRepository = new ProviderAvailabilityRepository();
export const userAccountBlockRepository = new UserAccountBlockRepository();
export const accountReactivationRequestRepository = new AccountReactivationRequestRepository();