import { UserController } from "../controller/user.controller";
import { CustomerController } from "../controller/customer.controller";
import { ProviderController } from "../controller/provider.controller";
import { AddressController } from "../controller/address.controller";

export interface UserRouteDependencies {
    user: UserController;
    customer: CustomerController;
    provider: ProviderController;
    address: AddressController;
}
