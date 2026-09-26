import RegisterCustomerUseCaseImpl from "../modules/auth/application/use-cases/register-customer.use-case.impl.js";
import { PrismaCustomerAuthRepositoryImpl } from "../modules/auth/infrastructure/repositories/prisma-customer.repository.impl.js";
import { BcryptPasswordHasherServiceImpl } from "../shared/infrastructure/security/becrypt-password-hasher.service.impl.js";
import CustomerAuthController from "../modules/auth/presentation/controllers/customer-auth.controller.js";
import { SecureOtpGeneratorServiceImpl } from "../shared/infrastructure/security/secure-otp-generate.service.impl.js";
import { NodemailerEmailSenderImpl } from "../shared/infrastructure/email/nodemailer/nodemailer-email-sender.impl.js";
import { RedisPendingRegistrationStoreImpl } from "../shared/infrastructure/cache/redis/redis-pending-registration.store.impl.js";
import OtpVarificationController from "../modules/auth/presentation/controllers/otp-varification.controller.js";
import OtpVarificationUseCaseImpl from "../modules/auth/application/use-cases/otp-varification.use-case.js";

// Shared Infrastructure Instances
const pendingRegistrationStore = new RedisPendingRegistrationStoreImpl();
const emailSender = new NodemailerEmailSenderImpl();
const otpGenerator = new SecureOtpGeneratorServiceImpl();
const passwordHasher = new BcryptPasswordHasherServiceImpl();

// Repositories
const customerRepository = new PrismaCustomerAuthRepositoryImpl();

// Use Cases
const registerCustomerUseCase = new RegisterCustomerUseCaseImpl(
  customerRepository,
  passwordHasher,
  otpGenerator,
  emailSender,
  pendingRegistrationStore
);
const otpVarificationUseCase = new OtpVarificationUseCaseImpl(
  pendingRegistrationStore,
  passwordHasher
);

// Controllers
export const customerAuthController = new CustomerAuthController(registerCustomerUseCase);
export const otpVarificationController = new OtpVarificationController(otpVarificationUseCase as any);
