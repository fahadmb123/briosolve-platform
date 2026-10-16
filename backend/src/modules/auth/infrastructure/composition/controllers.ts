import OtpVarificationController from "../../presentation/controllers/otpVarification.controller";
import { AuthController } from "../../presentation/controllers/auth.controller";
import { SecurityController } from "../../presentation/controllers/security.controller";

import {
  otpVarificationUseCase,
  resendOtpUseCase,
  loginUseCase,
  getMeUseCase,
  emailVerificationUseCase,
  updateEmailUseCase,
  resetPasswordUseCase,
  sendSmsOtpUseCase,
  updatePasswordUseCase,
  deletePhoneUseCase,
  refreshTokenUseCase,
  logoutUseCase
} from "./useCases";

import { pendingRegistrationStore } from "./services";

export const otpVarificationController = new OtpVarificationController(
  otpVarificationUseCase,
  pendingRegistrationStore,
  resendOtpUseCase
);

export const authController = new AuthController(
  loginUseCase,
  getMeUseCase,
  emailVerificationUseCase,
  updateEmailUseCase,
  refreshTokenUseCase,
  logoutUseCase
);

export const securityController = new SecurityController(
  resetPasswordUseCase,
  sendSmsOtpUseCase,
  updatePasswordUseCase,
  deletePhoneUseCase
);
