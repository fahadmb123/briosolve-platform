import { PrismaUserRepository } from "../infrastructure/repositories/prismaUser.repository.js";
import { PrismaCustomerRepository } from "../infrastructure/repositories/prismaCustomer.repository.js";
import { BcryptPasswordHasherService } from "../../../shared/infrastructure/security/becryptPasswordHasher.service.js";
import CustomerAuthController from "../presentation/controllers/customerAuth.controller.js";
import { SecureOtpGeneratorService } from "../../../shared/infrastructure/security/secureOtpGenerate.service.js";
import { NodemailerEmailSender } from "../../../shared/infrastructure/email/nodemailer/nodemailerEmail-sender.js";
import { RedisPendingRegistrationStore } from "../../../shared/infrastructure/cache/redis/redisPendingRegistration.store.js";
import OtpVarificationController from "../presentation/controllers/otpVarification.controller.js";
import OtpVarificationUseCase from "../application/use-cases/verification/otpVarification.useCase.js";

import ResendOtpUseCase from "../application/use-cases/verification/resendOtp.useCase.js";
import { AuthController } from "../presentation/controllers/auth.controller.js";
import LoginUseCase from "../application/use-cases/authentication/login.useCase.js";
import { JwtService } from "../../../shared/infrastructure/security/jwt.service.js";
import GetMeUseCase from "../application/use-cases/profile/getMe.useCase.js";
import EmailVerificationUseCase from "../application/use-cases/verification/emailVerification.useCase.js";
import ResetPasswordUseCase from "../application/use-cases/credentials/resetPassword.useCase.js";
import UpdateProfileUseCase from "../application/use-cases/profile/updateCustomerProfile.useCase.js";
import GetProfileUseCase from "../application/use-cases/profile/getProfile.useCase.js";
import UpdateEmailUseCase from "../application/use-cases/credentials/updateEmail.useCase.js";
import UpdatePasswordUseCase from "../application/use-cases/credentials/updatePassword.useCase.js";


import { TextBeeSmsService } from "../../../infrastructure/services/textbee/TextBeeSmsService.js";
import {SendSmsOtpUseCase} from "../application/use-cases/verification/sendSmsOtp.useCase.js";





// Services
const pendingRegistrationStore = new RedisPendingRegistrationStore()
const emailSender = new NodemailerEmailSender()
const otpGenerator = new SecureOtpGeneratorService()
const passwordHasher = new BcryptPasswordHasherService()
const jwtService = new JwtService()
const smsService = new TextBeeSmsService()


// Repo
const userRepository = new PrismaUserRepository();
const customerRepository = new PrismaCustomerRepository();



// Use Cases

const otpVarificationUseCase = new OtpVarificationUseCase(
  pendingRegistrationStore,
  passwordHasher,
  customerRepository,
  userRepository
)
const resendOtpUseCase = new ResendOtpUseCase(
  pendingRegistrationStore,
  passwordHasher,
  otpGenerator,
  emailSender
)
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
const updateProfileUseCase = new UpdateProfileUseCase(
  userRepository,
  customerRepository
)
const getProfileUseCase = new GetProfileUseCase(
  userRepository,
  customerRepository
)
const updateEmailUseCase = new UpdateEmailUseCase(
  userRepository,
  passwordHasher,
  otpGenerator,
  pendingRegistrationStore,
  emailSender
)
const updatePasswordUseCase = new UpdatePasswordUseCase(
  userRepository,
  passwordHasher
)
const sendSmsOtpUseCase = new SendSmsOtpUseCase(
  smsService,
  otpGenerator,
  passwordHasher,
  pendingRegistrationStore,
  userRepository
)


// Controllers
export const customerAuthController = new CustomerAuthController(
  updateProfileUseCase,
  updatePasswordUseCase
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
  resetPasswordUseCase,
  getProfileUseCase,
  updateEmailUseCase,
  sendSmsOtpUseCase
)