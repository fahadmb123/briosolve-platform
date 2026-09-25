import type { CustomerRegistrationInputType } from "../../../../presentation/http/validators/auth/registerCustomer.schema.js";

export interface RegisterCustomerUseCase {
  execute(input: CustomerRegistrationInputType): Promise<any>;
}