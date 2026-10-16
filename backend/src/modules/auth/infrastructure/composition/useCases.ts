import OtpVarificationUseCase from "../../application/use-cases/verification/otpVarification.useCase";
import ResendOtpUseCase from "../../application/use-cases/verification/resendOtp.useCase";
import LoginUseCase from "../../application/use-cases/authentication/login.useCase";
import RefreshTokenUseCase from "../../application/use-cases/authentication/refreshToken.useCase";
import LogoutUseCase from "../../application/use-cases/authentication/logout.useCase";
import GetMeUseCase from "../../application/use-cases/profile/getMe.useCase";
import EmailVerificationUseCase from "../../application/use-cases/verification/emailVerification.useCase";
import ResetPasswordUseCase from "../../application/use-cases/credentials/resetPassword.useCase";
import UpdateEmailUseCase from "../../application/use-cases/credentials/updateEmail.useCase";
import UpdatePasswordUseCase from "../../application/use-cases/credentials/updatePassword.useCase";
import { SendSmsOtpUseCase } from "../../application/use-cases/verification/sendSmsOtp.useCase";
import { DeletePhoneUseCase } from "../../application/use-cases/credentials/deletePhone.useCase";

import { userRepository, customerRepository, refreshSessionRepository } from "./repositories";
import {
  pendingRegistrationStore,
  passwordHasher,
  otpGenerator,
  emailSender,
  jwtService,
  smsService,
  refreshTokenService
} from "./services";

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
  jwtService,
  refreshSessionRepository,
  refreshTokenService
);

export const refreshTokenUseCase = new RefreshTokenUseCase(
  refreshSessionRepository,
  userRepository,
  jwtService,
  refreshTokenService
);

export const logoutUseCase = new LogoutUseCase(
  refreshSessionRepository,
  refreshTokenService
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
