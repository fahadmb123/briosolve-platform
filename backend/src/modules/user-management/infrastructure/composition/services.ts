import { RedisPendingRegistrationStore } from "../../../../shared/infrastructure/cache/redis/redisPendingRegistration.store";
import { NodemailerEmailSender } from "../../../../shared/infrastructure/email/nodemailer/nodemailerEmail-sender";
import { BcryptPasswordHasherService } from "../../../../shared/infrastructure/security/becryptPasswordHasher.service";
import { SecureOtpGeneratorService } from "../../../../shared/infrastructure/security/secureOtpGenerate.service";
import { CloudinaryService } from "../../../../shared/infrastructure/services/cloudinary.service";

export const passwordHasher = new BcryptPasswordHasherService();
export const otpGenerate = new SecureOtpGeneratorService();
export const emailSender = new NodemailerEmailSender();
export const pendingRegistrationStore = new RedisPendingRegistrationStore();
export const imageUploadService = new CloudinaryService();
