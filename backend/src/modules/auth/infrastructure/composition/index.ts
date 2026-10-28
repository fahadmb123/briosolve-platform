import { buildAuthRoute } from "../../presentation/routes/auth.routes";
import { authController, otpVarificationController, securityController } from "./controllers";

export const authRoutes = buildAuthRoute({
  auth:authController,
  otpVarification:otpVarificationController,
  security:securityController
}) 