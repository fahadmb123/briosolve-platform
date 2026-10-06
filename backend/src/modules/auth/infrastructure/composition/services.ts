import { BcryptPasswordHasherService } from "../../../../shared/infrastructure/security/becryptPasswordHasher.service.js";
import { SecureOtpGeneratorService } from "../../../../shared/infrastructure/security/secureOtpGenerate.service.js";
import { NodemailerEmailSender } from "../../../../shared/infrastructure/email/nodemailer/nodemailerEmail-sender.js";
import { RedisPendingRegistrationStore } from "../../../../shared/infrastructure/cache/redis/redisPendingRegistration.store.js";
import { JwtService } from "../../../../shared/infrastructure/security/jwt.service.js";
import { TextBeeSmsService } from "../../../../infrastructure/services/textbee/TextBeeSmsService.js";

export const pendingRegistrationStore = new RedisPendingRegistrationStore();
export const emailSender = new NodemailerEmailSender();
export const otpGenerator = new SecureOtpGeneratorService();
export const passwordHasher = new BcryptPasswordHasherService();
export const jwtService = new JwtService();
export const smsService = new TextBeeSmsService();
