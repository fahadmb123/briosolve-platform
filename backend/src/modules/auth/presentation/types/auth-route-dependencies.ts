import type { AuthController } from "../controllers/auth.controller";
import type OtpVarificationController from "../controllers/otpVarification.controller";
import type { SecurityController } from "../controllers/security.controller";

export interface AuthRouteDependencies {
    auth: AuthController;
    otpVarification: OtpVarificationController;
    security: SecurityController;
}