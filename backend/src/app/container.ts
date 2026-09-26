import RegisterCustomerUseCase from "../modules/auth/application/use-cases/registerCustomer.useCase.js";
import { PrismaCustomerAuthRepository } from "../modules/auth/infrastructure/repositories/prismaCustomer.repository.js";
import { BcryptPasswordHasherService } from "../shared/infrastructure/security/becryptPasswordHasher.service.js";
import CustomerAuthController from "../modules/auth/presentation/controllers/customerAuth.controller.js";
import { SecureOtpGeneratorService } from "../shared/infrastructure/security/secureOtpGenerate.service.js";
import { NodemailerEmailSender } from "../shared/infrastructure/email/nodemailer/nodemailerEmail-sender.js";
import { RedisPendingRegistrationStore } from "../shared/infrastructure/cache/redis/redisPendingRegistration.store.js";
import OtpVarificationController from "../modules/auth/presentation/controllers/otpVarification.controller.js";
import OtpVarificationUseCase from "../modules/auth/application/use-cases/otpVarification.useCase.js";

// Shared Infrastructure Instances
const pendingRegistrationStore = new RedisPendingRegistrationStore();
const emailSender = new NodemailerEmailSender();
const otpGenerator = new SecureOtpGeneratorService();
const passwordHasher = new BcryptPasswordHasherService();

// Repositories
const customerRepository = new PrismaCustomerAuthRepository();

// Use Cases
const registerCustomerUseCase = new RegisterCustomerUseCase(
  customerRepository,
  passwordHasher,
  otpGenerator,
  emailSender,
  pendingRegistrationStore
);
const otpVarificationUseCase = new OtpVarificationUseCase(
  pendingRegistrationStore,
  passwordHasher
);

// Controllers
export const customerAuthController = new CustomerAuthController(registerCustomerUseCase);
export const otpVarificationController = new OtpVarificationController(otpVarificationUseCase as any);
