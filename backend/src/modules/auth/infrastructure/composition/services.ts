import { BcryptPasswordHasherService } from "../../../../shared/services/becryptPasswordHasher.service";
import { SecureOtpGeneratorService } from "../../../../shared/services/secureOtpGenerate.service";
import { NodemailerEmailSender } from "../../../../shared/services/nodemailerEmail-sender";
import { RedisPendingRegistrationStore } from "../../../../shared/database/redisPendingRegistration.store";
import { JwtService } from "../../../../shared/services/jwt.service";
import { TextBeeSmsService } from "../../../../shared/services/textBeeSmsService";



export const pendingRegistrationStore = new RedisPendingRegistrationStore();
export const emailSender = new NodemailerEmailSender();
export const otpGenerator = new SecureOtpGeneratorService();
export const passwordHasher = new BcryptPasswordHasherService();
export const jwtService = new JwtService();
export const smsService = new TextBeeSmsService();
