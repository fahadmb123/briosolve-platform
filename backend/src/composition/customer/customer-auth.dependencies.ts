import RegisterCustomerUseCaseImpl from "../../application/use-cases/customer/register-customer.use-case.impl.js";
import CustomerAuthController from "../../presentation/http/controllers/customer/customer-auth.controller.js";
//const customerRepository = new PrismaCustomerRepository();
const registerCustomerUseCase = new RegisterCustomerUseCaseImpl


export const customerAuthController = new CustomerAuthController(registerCustomerUseCase);