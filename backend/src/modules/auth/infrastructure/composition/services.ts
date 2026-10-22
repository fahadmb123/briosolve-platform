import { BcryptPasswordHasherService } from "../../../../shared/infrastructure/security/becryptPasswordHasher.service";
import { SecureOtpGeneratorService } from "../../../../shared/infrastructure/security/secureOtpGenerate.service";
import { NodemailerEmailSender } from "../../../../shared/infrastructure/email/nodemailer/nodemailerEmail-sender";
import { RedisPendingRegistrationStore } from "../../../../shared/infrastructure/cache/redis/redisPendingRegistration.store";
import { JwtService } from "../../../../shared/infrastructure/security/jwt.service";
import { TextBeeSmsService } from "../../../../infrastructure/services/textbee/TextBeeSmsService";

export const pendingRegistrationStore = new RedisPendingRegistrationStore();
export const emailSender = new NodemailerEmailSender();
export const otpGenerator = new SecureOtpGeneratorService();
export const passwordHasher = new BcryptPasswordHasherService();
export const jwtService = new JwtService();
export const smsService = new TextBeeSmsService();
