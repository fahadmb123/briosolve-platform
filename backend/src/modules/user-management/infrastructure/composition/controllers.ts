import { AddressController } from "../../presentation/controller/address.controller.js";
import { CustomerController } from "../../presentation/controller/customer.controller.js";
import { UserController } from "../../presentation/controller/user.controller.js";

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
    setDefaultAddressUseCase
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