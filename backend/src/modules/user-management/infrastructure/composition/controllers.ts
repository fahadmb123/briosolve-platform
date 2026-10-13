import { AddressController } from "../../presentation/controller/address.controller.js";
import { CustomerController } from "../../presentation/controller/customer.controller.js";
import { UserController } from "../../presentation/controller/user.controller.js";
import { ProviderController } from "../../presentation/controller/provider.controller.js";

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
    getProvidersUseCase
} from "./useCases.js";
import { imageUploadService } from "./services.js";

export const userController = new UserController(
    updateUserStatusUseCase,
    getProfileUseCase
);

export const customerController = new CustomerController(
    getCustomerUseCase,
    registerCustomerUseCase,
    updateCustomerProfileUseCase,
    imageUploadService
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
    imageUploadService,
    getProvidersUseCase
);