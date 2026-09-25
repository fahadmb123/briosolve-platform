import { Customer } from "../entities/customer/customer-auth.entity.js"





export type RegisterCustomerInput = {
  name:string,
  email : string,
  password:string
}
export interface CustomerAuthRepository {
  findByEmail(email: string): Promise<Customer | null>
  createCustomer(data: RegisterCustomerInput): Promise<Customer>
}