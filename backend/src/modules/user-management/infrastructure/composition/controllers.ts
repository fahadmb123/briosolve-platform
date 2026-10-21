import { AddressController } from "../../presentation/controller/address.controller";
import { CustomerController } from "../../presentation/controller/customer.controller";
import { UserController } from "../../presentation/controller/user.controller";
import { ProviderController } from "../../presentation/controller/provider.controller";
import { ReactivationController } from "../../presentation/controller/reactivation.controller";

import {
    getCustomerUseCase,
    updateUserStatusUseCase,
    registerCustomerUseCase,
    getProfileUseCase,
    updateCustomerProfileUseCase,
    addAddressUseCase,
    getAddressesUseCase,
    editAddressUseCase,
    deleteAddressUseCase,
    setDefaultAddressUseCase,
    preRegisterProviderUseCase,
    registerProviderUseCase,
    updateProviderProfileUseCase,
    setProviderAvailabilityUseCase,
    getProviderAvailabilityUseCase,
    getProviderAvailabilityOverridesUseCase,
    createProviderAvailabilityOverrideUseCase,
    deleteProviderAvailabilityOverrideUseCase,
    getProvidersUseCase,
    createAccountReactivationRequestUseCase,
    getReactivationRequestsUseCase,
    sendReactivationOtpUseCase,
    sendBecomeProviderOtpUseCase,
    becomeProviderUseCase,
    sendBecomeCustomerOtpUseCase,
    becomeCustomerUseCase
} from "./useCases";
import { imageUploadService } from "./services";
import { jwtService } from "../../../auth/infrastructure/composition/services";

export const userController = new UserController(
    updateUserStatusUseCase,
    getProfileUseCase
);

export const reactivationController = new ReactivationController(
    createAccountReactivationRequestUseCase,
    getReactivationRequestsUseCase,
    sendReactivationOtpUseCase
);

export const customerController = new CustomerController(
    getCustomerUseCase,
    registerCustomerUseCase,
    updateCustomerProfileUseCase,
    imageUploadService,
    sendBecomeProviderOtpUseCase,
    becomeProviderUseCase,
    jwtService
);
export const addressController = new AddressController(
    addAddressUseCase,
    getAddressesUseCase,
    editAddressUseCase,
    deleteAddressUseCase,
    setDefaultAddressUseCase
)


export const providerController = new ProviderController(
    preRegisterProviderUseCase,
    registerProviderUseCase,
    updateProviderProfileUseCase,
    setProviderAvailabilityUseCase,
    getProviderAvailabilityUseCase,
    getProviderAvailabilityOverridesUseCase,
    createProviderAvailabilityOverrideUseCase,
    deleteProviderAvailabilityOverrideUseCase,
    sendBecomeCustomerOtpUseCase,
    imageUploadService,
    getProvidersUseCase,
    becomeCustomerUseCase,
    jwtService
);