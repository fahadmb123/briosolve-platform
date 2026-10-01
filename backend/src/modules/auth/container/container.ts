import RegisterCustomerUseCase from "../application/use-cases/registerCustomer.useCase.js";
import { PrismaUserRepository } from "../infrastructure/repositories/prismaUser.repository.js";
import { PrismaCustomerRepository } from "../infrastructure/repositories/prismaCustomer.repository.js";
import { BcryptPasswordHasherService } from "../../../shared/infrastructure/security/becryptPasswordHasher.service.js";
import CustomerAuthController from "../presentation/controllers/customerAuth.controller.js";
import { SecureOtpGeneratorService } from "../../../shared/infrastructure/security/secureOtpGenerate.service.js";
import { NodemailerEmailSender } from "../../../shared/infrastructure/email/nodemailer/nodemailerEmail-sender.js";
import { RedisPendingRegistrationStore } from "../../../shared/infrastructure/cache/redis/redisPendingRegistration.store.js";
import OtpVarificationController from "../presentation/controllers/otpVarification.controller.js";
import OtpVarificationUseCase from "../application/use-cases/otpVarification.useCase.js";

import ResendOtpUseCase from "../application/use-cases/resendOtp.useCase.js";
import { AuthController } from "../presentation/controllers/auth.controller.js";
import LoginUseCase from "../application/use-cases/login.useCase.js";
import { JwtService } from "../../../shared/infrastructure/security/jwt.service.js";
import GetMeUseCase from "../application/use-cases/getMe.useCase.js";
import EmailVerificationUseCase from "../application/use-cases/emailVerification.useCase.js";
import ResetPasswordUseCase from "../application/use-cases/resetPassword.useCase.js";
import UpdateProfileUseCase from "../application/use-cases/updateCustomerProfile.useCase.js";






// Services Shared...
const pendingRegistrationStore = new RedisPendingRegistrationStore()
const emailSender = new NodemailerEmailSender()
const otpGenerator = new SecureOtpGeneratorService()
const passwordHasher = new BcryptPasswordHasherService()
const jwtService = new JwtService()





// Repo
const userRepository = new PrismaUserRepository();
const customerRepository = new PrismaCustomerRepository();






// Use Cases
const registerCustomerUseCase = new RegisterCustomerUseCase(
  userRepository,
  passwordHasher,
  otpGenerator,
  emailSender,
  pendingRegistrationStore
)

const otpVarificationUseCase = new OtpVarificationUseCase(
  pendingRegistrationStore,
  passwordHasher,
  customerRepository
)

const resendOtpUseCase = new ResendOtpUseCase(
  pendingRegistrationStore,
  passwordHasher,
  otpGenerator,
  emailSender
)
//auth
const loginUseCase = new LoginUseCase(
  userRepository,
  passwordHasher,
  jwtService
)
const getMeUseCase = new GetMeUseCase(userRepository)

const emailVerificationUseCase = new EmailVerificationUseCase(
  userRepository,
  passwordHasher,
  otpGenerator,
  pendingRegistrationStore,
  emailSender
)

const resetPasswordUseCase = new ResetPasswordUseCase(
  pendingRegistrationStore,
  passwordHasher,
  userRepository
)

const updateProfileUseCase = new UpdateProfileUseCase(userRepository, customerRepository)




// Controllers
export const customerAuthController = new CustomerAuthController(
  registerCustomerUseCase,
  updateProfileUseCase
)

export const otpVarificationController = new OtpVarificationController(
    otpVarificationUseCase,
    pendingRegistrationStore,
    resendOtpUseCase
)

export const authController = new AuthController(
  loginUseCase,
  getMeUseCase,
  emailVerificationUseCase,
  resetPasswordUseCase
)