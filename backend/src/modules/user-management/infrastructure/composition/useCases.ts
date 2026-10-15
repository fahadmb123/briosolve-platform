import { AddAddressUseCase } from "../../application/use-cases/addAddress.useCase";
import { DeleteAddressUseCase } from "../../application/use-cases/deleteAddress.useCase";
import { EditAddressUseCase } from "../../application/use-cases/editAddress.useCase";
import { GetAddressesUseCase } from "../../application/use-cases/getAddresses.useCase";
import GetCustomersUseCase from "../../application/use-cases/getCustomers.useCase";
import GetProvidersUseCase from "../../application/use-cases/getProviders.useCase";
import GetProfileUseCase from "../../application/use-cases/getProfile.useCase";
import RegisterCustomerUseCase from "../../application/use-cases/registerCustomer.useCase";
import RegisterProviderUseCase from "../../application/use-cases/registerProvider.useCase";
import PreRegisterProviderUseCase from "../../application/use-cases/preRegisterProvider.useCase";
import { SetDefaultAddressUseCase } from "../../application/use-cases/setDefaulltAddress.useCase";
import UpdateCustomerProfileUseCase from "../../application/use-cases/updateCustomerProfile.useCase";
import UpdateProviderProfileUseCase from "../../application/use-cases/updateProviderProfile.useCase";
import UpdateUserStatusUseCase from "../../application/use-cases/updateUser.useCase";
import SetProviderAvailabilityUseCase from "../../application/use-cases/setProviderAvailability.useCase";
import GetProviderAvailabilityUseCase from "../../application/use-cases/getProviderAvailability.useCase";
import GetProviderAvailabilityOverridesUseCase from "../../application/use-cases/getProviderAvailabilityOverrides.useCase";
import CreateProviderAvailabilityOverrideUseCase from "../../application/use-cases/createProviderAvailabilityOverride.useCase";
import DeleteProviderAvailabilityOverrideUseCase from "../../application/use-cases/deleteProviderAvailabilityOverride.useCase";
import { CreateAccountReactivationRequestUseCase } from "../../application/use-cases/createAccountReactivationRequest.useCase";
import { GetReactivationRequestsUseCase } from "../../application/use-cases/getReactivationRequests.useCase";
import { SendReactivationOtpUseCase } from "../../application/use-cases/sendReactivationOtp.useCase";
import { SendBecomeProviderOtpUseCase } from "../../application/use-cases/sendBecomeProviderOtp.useCase";
import { BecomeProviderUseCase } from "../../application/use-cases/becomeProvider.useCase";

import { userRepository, customerRepository, addressRepository, providerRepository, providerAvailabilityRepository, userAccountBlockRepository, accountReactivationRequestRepository } from "./repositories";
import {
    passwordHasher,
    otpGenerate,
    emailSender,
    pendingRegistrationStore,
    imageUploadService
} from "./services";


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
    pendingRegistrationStore,
    providerAvailabilityRepository
)
export const getCustomerUseCase = new GetCustomersUseCase(
    userRepository
)
export const getProvidersUseCase = new GetProvidersUseCase(
    userRepository
)
export const updateUserStatusUseCase = new UpdateUserStatusUseCase(
    userRepository,
    userAccountBlockRepository,
    emailSender,
    accountReactivationRequestRepository
)
export const createAccountReactivationRequestUseCase = new CreateAccountReactivationRequestUseCase(
    userRepository,
    userAccountBlockRepository,
    accountReactivationRequestRepository,
    emailSender,
    pendingRegistrationStore
)
export const sendReactivationOtpUseCase = new SendReactivationOtpUseCase(
    userRepository,
    userAccountBlockRepository,
    accountReactivationRequestRepository,
    passwordHasher,
    otpGenerate,
    emailSender,
    pendingRegistrationStore
)
export const getReactivationRequestsUseCase = new GetReactivationRequestsUseCase(
    accountReactivationRequestRepository
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
    providerRepository,
    imageUploadService
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
);
export const setProviderAvailabilityUseCase = new SetProviderAvailabilityUseCase(
    providerRepository,
    providerAvailabilityRepository
);
export const getProviderAvailabilityUseCase = new GetProviderAvailabilityUseCase(
    providerRepository,
    providerAvailabilityRepository
);
export const getProviderAvailabilityOverridesUseCase = new GetProviderAvailabilityOverridesUseCase(
    providerRepository,
    providerAvailabilityRepository
);
export const createProviderAvailabilityOverrideUseCase = new CreateProviderAvailabilityOverrideUseCase(
    providerRepository,
    providerAvailabilityRepository
);
export const deleteProviderAvailabilityOverrideUseCase = new DeleteProviderAvailabilityOverrideUseCase(
    providerRepository,
    providerAvailabilityRepository
);
export const sendBecomeProviderOtpUseCase = new SendBecomeProviderOtpUseCase(
    userRepository,
    passwordHasher,
    otpGenerate,
    emailSender,
    pendingRegistrationStore
);
export const becomeProviderUseCase = new BecomeProviderUseCase(
    userRepository,
    customerRepository,
    providerRepository,
    providerAvailabilityRepository,
    pendingRegistrationStore
);