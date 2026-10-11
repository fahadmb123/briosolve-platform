import { AddAddressUseCase } from "../../application/use-cases/addAddress.useCase.js";
import { DeleteAddressUseCase } from "../../application/use-cases/deleteAddress.useCase.js";
import { EditAddressUseCase } from "../../application/use-cases/editAddress.useCase.js";
import { GetAddressesUseCase } from "../../application/use-cases/getAddresses.useCase.js";
import GetCustomersUseCase from "../../application/use-cases/getCustomers.useCase.js";
import GetProfileUseCase from "../../application/use-cases/getProfile.useCase.js";
import RegisterCustomerUseCase from "../../application/use-cases/registerCustomer.useCase.js";
import RegisterProviderUseCase from "../../application/use-cases/registerProvider.useCase.js";
import PreRegisterProviderUseCase from "../../application/use-cases/preRegisterProvider.useCase.js";
import { SetDefaultAddressUseCase } from "../../application/use-cases/setDefaulltAddress.useCase.js";
import UpdateCustomerProfileUseCase from "../../application/use-cases/updateCustomerProfile.useCase.js";
import UpdateProviderProfileUseCase from "../../application/use-cases/updateProviderProfile.useCase.js";
import UpdateUserStatusUseCase from "../../application/use-cases/updateUser.useCase.js";

import { userRepository, customerRepository, addressRepository, providerRepository } from "./repositories.js";
import {
    passwordHasher,
    otpGenerate,
    emailSender,
    pendingRegistrationStore
} from "./services.js";


export const registerCustomerUseCase = new RegisterCustomerUseCase(
    userRepository,
    passwordHasher,
    otpGenerate,
    emailSender,
    pendingRegistrationStore
)
export const preRegisterProviderUseCase = new PreRegisterProviderUseCase(
    userRepository,
    passwordHasher,
    otpGenerate,
    emailSender,
    pendingRegistrationStore
)
export const registerProviderUseCase = new RegisterProviderUseCase(
    providerRepository,
    pendingRegistrationStore
)
export const getCustomerUseCase = new GetCustomersUseCase(
    userRepository
)
export const updateUserStatusUseCase = new UpdateUserStatusUseCase(
    userRepository
)
export const getProfileUseCase = new GetProfileUseCase(
    userRepository,
    customerRepository,
    providerRepository
);
export const updateCustomerProfileUseCase = new UpdateCustomerProfileUseCase(
    userRepository,
    customerRepository
)
export const updateProviderProfileUseCase = new UpdateProviderProfileUseCase(
    userRepository,
    providerRepository
)
export const addAddressUseCase = new AddAddressUseCase(
    addressRepository,
    userRepository
)
export const getAddressesUseCase = new GetAddressesUseCase(
    addressRepository
)
export const editAddressUseCase = new EditAddressUseCase(
    addressRepository
)
export const deleteAddressUseCase = new DeleteAddressUseCase(
    addressRepository
)
export const setDefaultAddressUseCase = new SetDefaultAddressUseCase(
    userRepository
)