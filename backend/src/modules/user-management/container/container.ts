import { RedisPendingRegistrationStore } from "../../../shared/infrastructure/cache/redis/redisPendingRegistration.store.js";
import { NodemailerEmailSender } from "../../../shared/infrastructure/email/nodemailer/nodemailerEmail-sender.js";
import { BcryptPasswordHasherService } from "../../../shared/infrastructure/security/becryptPasswordHasher.service.js";
import { SecureOtpGeneratorService } from "../../../shared/infrastructure/security/secureOtpGenerate.service.js";
import GetCustomersUseCase from "../application/use-cases/getCustomers.useCase.js";
import GetProfileUseCase from "../application/use-cases/getProfile.useCase.js";
import RegisterCustomerUseCase from "../application/use-cases/registerCustomer.useCase.js";
import UpdateUserStatusUseCase from "../application/use-cases/updateUser.useCase.js";
import { CustomerRepository } from "../infrastructure/repositories/prismaCustomer.repository.js";
import { UserRepository } from "../infrastructure/repositories/prismaUser.repository.js";
import { CustomerController } from "../presentation/controller/customer.controller.js";
import { UserController } from "../presentation/controller/user.controller.js";



const passwordHasher = new BcryptPasswordHasherService()
const otpGenerate = new SecureOtpGeneratorService()
const emailSender = new NodemailerEmailSender()
const pendingRegistrationStore = new RedisPendingRegistrationStore()

const userRepository = new UserRepository()
const customerRepository = new CustomerRepository()


const getCustomerUseCase = new GetCustomersUseCase(userRepository)
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository)
const registerCustomerUseCase = new RegisterCustomerUseCase(
    userRepository,
    passwordHasher,
    otpGenerate,
    emailSender,
    pendingRegistrationStore
)
const getProfileUseCase = new GetProfileUseCase(
    userRepository,
    customerRepository
)




export const userController = new UserController(
    updateUserStatusUseCase,
    getProfileUseCase
)
export const customerController = new CustomerController(
    getCustomerUseCase,
    registerCustomerUseCase
)