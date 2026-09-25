import RegisterCustomerUseCaseImpl from "../../application/use-cases/auth/customer/register-customer.use-case.impl.js";
import { PrismaCustomerAuthRepositoryImpl } from "../../infrastructure/persistence/prisma/repositories/prisma-customer.repository.impl.js";
import CustomerAuthController from "../../presentation/http/controllers/customer/customer-auth.controller.js";


const customerRepository = new PrismaCustomerAuthRepositoryImpl();
const registerCustomerUseCase = new RegisterCustomerUseCaseImpl(customerRepository)

export const customerAuthController = new CustomerAuthController(registerCustomerUseCase);