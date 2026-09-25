import RegisterCustomerUseCaseImpl from "../../application/use-cases/auth/customer/register-customer.use-case.impl.js";
import { PrismaCustomerAuthRepositoryImpl } from "../../infrastructure/persistence/prisma/repositories/prisma-customer.repository.impl.js";
import { BcryptPasswordHasherServiceImpl } from "../../infrastructure/security/becrypt-password-hasher.service.impl.js";
import CustomerAuthController from "../../presentation/http/controllers/customer/customer-auth.controller.js";
import { SecureOtpGeneratorServiceImpl } from "../../infrastructure/security/secure-otp-generate.service.impl.js";
import { NodemailerEmailSenderImpl } from "../../infrastructure/email/nodemailer/nodemailer-email-sender.impl.js";
import { RedisPendingRegistrationStoreImpl } from "../../infrastructure/cache/redis/redis-pending-registration.store.impl.js";


const PendingRegistrationStore = new RedisPendingRegistrationStoreImpl()
const EmailSender = new NodemailerEmailSenderImpl()
const otpGenerator = new SecureOtpGeneratorServiceImpl()
const passwordHasher = new BcryptPasswordHasherServiceImpl()
const customerRepository = new PrismaCustomerAuthRepositoryImpl();
const registerCustomerUseCase = new RegisterCustomerUseCaseImpl(customerRepository,passwordHasher,otpGenerator,EmailSender,PendingRegistrationStore)

export const customerAuthController = new CustomerAuthController(registerCustomerUseCase);