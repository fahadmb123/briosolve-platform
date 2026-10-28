import { Router } from "express";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { otpSchema } from "../validators/registerCustomer.schema";
import { emailSchema, loginSchema, resetPasswordSchema, phoneSchema, updatePasswordSchema } from "../validators/auth.schema";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { AuthRouteDependencies } from "../types/auth-route-dependencies";


export function buildAuthRoute(controller:AuthRouteDependencies):Router{
    const router = Router()
    
    router.post("/refresh", controller.auth.refresh)
    router.post("/logout", controller.auth.logout)
    router.get("/logout", controller.auth.logout)
    router.get("/otp-status", controller.otpVarification.getStatus)
    router.get("/me", authMiddleware, requireRole(["CUSTOMER", "PROVIDER", "ADMIN"]), controller.auth.getMe)

    router.post("/login", validate(loginSchema), controller.auth.login);
    router.post("/email-verify", validate(emailSchema), controller.auth.emailVerify);
    router.post("/reset-password", validate(resetPasswordSchema), controller.security.resetPassword)
    router.post("/otp-varify", validate(otpSchema), controller.otpVarification.validate);
    router.post("/resend-otp", controller.otpVarification.resend);

    router.patch("/email", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), validate(emailSchema), controller.auth.emailVerify);
    router.patch("/password", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), validate(updatePasswordSchema), controller.security.updatePassword)
    router.patch("/phone", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), validate(phoneSchema), controller.security.updatePhone);

    router.delete("/phone", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), controller.security.deletePhone)

    return router
}