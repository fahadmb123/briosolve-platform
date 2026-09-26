import { RegisterCustomerInput,RegisterCustomerOutput } from "../../../dto/customer/customer-auth.type.js";

export interface RegisterCustomerUseCase {
  execute(input: RegisterCustomerInput): Promise<RegisterCustomerOutput>;
}