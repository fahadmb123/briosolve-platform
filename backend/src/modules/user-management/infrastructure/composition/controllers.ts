import { AddressController } from "../../presentation/controller/address.controller.js";
import { CustomerController } from "../../presentation/controller/customer.controller.js";
import { UserController } from "../../presentation/controller/user.controller.js";

import {
    getCustomerUseCase,
    updateUserStatusUseCase,
    registerCustomerUseCase,
    getProfileUseCase,
    updateCustomerProfileUseCase,
    addAddressUseCase
} from "./useCases.js";

export const userController = new UserController(
    updateUserStatusUseCase,
    getProfileUseCase
);

export const customerController = new CustomerController(
    getCustomerUseCase,
    registerCustomerUseCase,
    updateCustomerProfileUseCase
);
export const addressController = new AddressController(
    addAddressUseCase
)