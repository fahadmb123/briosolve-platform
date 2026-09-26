import { Customer } from "../entities/customer.entity.js"





export type RegisterCustomerInput = {
  name:string,
  email : string,
  password:string
}
export interface ICustomerAuthRepository {
  findByEmail(email: string): Promise<Customer | null>
  createCustomer(data: RegisterCustomerInput): Promise<Customer>
}