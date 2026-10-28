import { buildVerificationRoute } from "../../presentation/routes/verification.routes";
import { verificationController } from "./controller";

export const verificationRoutes = buildVerificationRoute({
    verification:verificationController
})