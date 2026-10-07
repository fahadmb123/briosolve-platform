import { AddAddressUseCase } from "../../application/use-cases/addAddress.useCase.js";
import { EditAddressUseCase } from "../../application/use-cases/editAddress.useCase.js";
import { GetAddressesUseCase } from "../../application/use-cases/getAddresses.useCase.js";
import GetCustomersUseCase from "../../application/use-cases/getCustomers.useCase.js";
import GetProfileUseCase from "../../application/use-cases/getProfile.useCase.js";
import RegisterCustomerUseCase from "../../application/use-cases/registerCustomer.useCase.js";
import UpdateCustomerProfileUseCase from "../../application/use-cases/updateCustomerProfile.useCase.js";
import UpdateUserStatusUseCase from "../../application/use-cases/updateUser.useCase.js";

import { userRepository, customerRepository, addressRepository } from "./repositories.js";
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
export const getCustomerUseCase = new GetCustomersUseCase(
    userRepository
)
export const updateUserStatusUseCase = new UpdateUserStatusUseCase(
    userRepository
)
export const getProfileUseCase = new GetProfileUseCase(
    userRepository,
    customerRepository
);
export const updateCustomerProfileUseCase = new UpdateCustomerProfileUseCase(
    userRepository,
    customerRepository
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