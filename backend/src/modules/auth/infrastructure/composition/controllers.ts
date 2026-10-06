import OtpVarificationController from "../../presentation/controllers/otpVarification.controller.js";
import { AuthController } from "../../presentation/controllers/auth.controller.js";
import { SecurityController } from "../../presentation/controllers/security.controller.js";

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
  deletePhoneUseCase
} from "./useCases.js";

import { pendingRegistrationStore } from "./services.js";

export const otpVarificationController = new OtpVarificationController(
  otpVarificationUseCase,
  pendingRegistrationStore,
  resendOtpUseCase
);

export const authController = new AuthController(
  loginUseCase,
  getMeUseCase,
  emailVerificationUseCase,
  updateEmailUseCase
);

export const securityController = new SecurityController(
  resetPasswordUseCase,
  sendSmsOtpUseCase,
  updatePasswordUseCase,
  deletePhoneUseCase
);
