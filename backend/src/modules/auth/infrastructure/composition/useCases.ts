import OtpVarificationUseCase from "../../application/use-cases/verification/otpVarification.useCase.js";
import ResendOtpUseCase from "../../application/use-cases/verification/resendOtp.useCase.js";
import LoginUseCase from "../../application/use-cases/authentication/login.useCase.js";
import GetMeUseCase from "../../application/use-cases/profile/getMe.useCase.js";
import EmailVerificationUseCase from "../../application/use-cases/verification/emailVerification.useCase.js";
import ResetPasswordUseCase from "../../application/use-cases/credentials/resetPassword.useCase.js";
import UpdateEmailUseCase from "../../application/use-cases/credentials/updateEmail.useCase.js";
import UpdatePasswordUseCase from "../../application/use-cases/credentials/updatePassword.useCase.js";
import { SendSmsOtpUseCase } from "../../application/use-cases/verification/sendSmsOtp.useCase.js";
import { DeletePhoneUseCase } from "../../application/use-cases/credentials/deletePhone.useCase.js";

import { userRepository, customerRepository } from "./repositories.js";
import {
  pendingRegistrationStore,
  passwordHasher,
  otpGenerator,
  emailSender,
  jwtService,
  smsService
} from "./services.js";

export const otpVarificationUseCase = new OtpVarificationUseCase(
  pendingRegistrationStore,
  passwordHasher,
  customerRepository,
  userRepository
);

export const resendOtpUseCase = new ResendOtpUseCase(
  pendingRegistrationStore,
  passwordHasher,
  otpGenerator,
  emailSender
);

export const loginUseCase = new LoginUseCase(
  userRepository,
  passwordHasher,
  jwtService
);

export const getMeUseCase = new GetMeUseCase(userRepository);

export const emailVerificationUseCase = new EmailVerificationUseCase(
  userRepository,
  passwordHasher,
  otpGenerator,
  pendingRegistrationStore,
  emailSender
);

export const resetPasswordUseCase = new ResetPasswordUseCase(
  pendingRegistrationStore,
  passwordHasher,
  userRepository
);

export const updateEmailUseCase = new UpdateEmailUseCase(
  userRepository,
  passwordHasher,
  otpGenerator,
  pendingRegistrationStore,
  emailSender
);

export const updatePasswordUseCase = new UpdatePasswordUseCase(
  userRepository,
  passwordHasher
);

export const sendSmsOtpUseCase = new SendSmsOtpUseCase(
  smsService,
  otpGenerator,
  passwordHasher,
  pendingRegistrationStore,
  userRepository
);

export const deletePhoneUseCase = new DeletePhoneUseCase(userRepository);
