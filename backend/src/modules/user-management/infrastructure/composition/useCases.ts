import { AddAddressUseCase } from "../../application/use-cases/addresses/addAddress.useCase";
import { DeleteAddressUseCase } from "../../application/use-cases/addresses/deleteAddress.useCase";
import { EditAddressUseCase } from "../../application/use-cases/addresses/editAddress.useCase";
import { GetAddressesUseCase } from "../../application/use-cases/addresses/getAddresses.useCase";
import GetCustomersUseCase from "../../application/use-cases/administration/getCustomers.useCase";
import GetProvidersUseCase from "../../application/use-cases/administration/getProviders.useCase";
import GetProfileUseCase from "../../application/use-cases/profiles/getProfile.useCase";
import RegisterCustomerUseCase from "../../application/use-cases/onboarding/registerCustomer.useCase";
import RegisterProviderUseCase from "../../application/use-cases/onboarding/registerProvider.useCase";
import PreRegisterProviderUseCase from "../../application/use-cases/onboarding/preRegisterProvider.useCase";
import { SetDefaultAddressUseCase } from "../../application/use-cases/addresses/setDefaulltAddress.useCase";
import UpdateCustomerProfileUseCase from "../../application/use-cases/profiles/updateCustomerProfile.useCase";
import UpdateProviderProfileUseCase from "../../application/use-cases/profiles/updateProviderProfile.useCase";
import UpdateUserStatusUseCase from "../../application/use-cases/administration/updateUser.useCase";
import SetProviderAvailabilityUseCase from "../../application/use-cases/availability/setProviderAvailability.useCase";
import GetProviderAvailabilityUseCase from "../../application/use-cases/availability/getProviderAvailability.useCase";
import GetProviderAvailabilityOverridesUseCase from "../../application/use-cases/availability/getProviderAvailabilityOverrides.useCase";
import CreateProviderAvailabilityOverrideUseCase from "../../application/use-cases/availability/createProviderAvailabilityOverride.useCase";
import DeleteProviderAvailabilityOverrideUseCase from "../../application/use-cases/availability/deleteProviderAvailabilityOverride.useCase";
import { CreateAccountReactivationRequestUseCase } from "../../application/use-cases/reactivation/createAccountReactivationRequest.useCase";
import { GetReactivationRequestsUseCase } from "../../application/use-cases/reactivation/getReactivationRequests.useCase";
import { SendReactivationOtpUseCase } from "../../application/use-cases/reactivation/sendReactivationOtp.useCase";
import { SendBecomeProviderOtpUseCase } from "../../application/use-cases/onboarding/sendBecomeProviderOtp.useCase";
import { BecomeProviderUseCase } from "../../application/use-cases/onboarding/becomeProvider.useCase";

import { userRepository, customerRepository, addressRepository, providerRepository, providerAvailabilityRepository, userAccountBlockRepository, accountReactivationRequestRepository } from "./repositories";
import {
    passwordHasher,
    otpGenerate,
    emailSender,
    pendingRegistrationStore,
    imageUploadService
} from "./services";
import { SendBecomeCustomerOtpUseCase } from "../../application/use-cases/onboarding/sendBecomeCustomerOtp.useCase";
import { BecomeCustomerUseCase } from "../../application/use-cases/onboarding/becomeCustomer.useCase";
import { providerServiceRepository } from "../../../service-catalog/infrastructure/composition/respositories";
import { verificationDocumentRepository, verificationFileRepository } from "../../../kyc-verification/infrastructure/composition/repositories";


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


export function createUpdateUserStatusUseCase(
    createNotificationUseCase: IUseCase<CreateNotificationRequestDto,NotificationResponseDto>,
): UpdateUserStatusUseCase {
    return new UpdateUserStatusUseCase(
        userRepository,
        userAccountBlockRepository,
        emailSender,
        accountReactivationRequestRepository,
        createNotificationUseCase,
    );
}

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
export const sendBecomeCustomerOtpUseCase = new SendBecomeCustomerOtpUseCase(
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
export const becomeCustomerUseCase = new BecomeCustomerUseCase(
    userRepository,
    customerRepository,
    providerRepository,
    providerAvailabilityRepository,
    pendingRegistrationStore,
    providerServiceRepository,
    verificationDocumentRepository,
    verificationFileRepository
);
import { GetNearbyProvidersUseCase } from "../../application/use-cases/customers/getNearbyProviders.useCase";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
export const getNearbyProvidersUseCase = new GetNearbyProvidersUseCase(
    userRepository,
    customerRepository
);