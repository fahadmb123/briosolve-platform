import { RedisPendingRegistrationStore } from "../../../../shared/infrastructure/cache/redis/redisPendingRegistration.store.js";
import { NodemailerEmailSender } from "../../../../shared/infrastructure/email/nodemailer/nodemailerEmail-sender.js";
import { BcryptPasswordHasherService } from "../../../../shared/infrastructure/security/becryptPasswordHasher.service.js";
import { SecureOtpGeneratorService } from "../../../../shared/infrastructure/security/secureOtpGenerate.service.js";
import { CloudinaryService } from "../../../../shared/infrastructure/services/cloudinary.service.js";

export const passwordHasher = new BcryptPasswordHasherService();
export const otpGenerate = new SecureOtpGeneratorService();
export const emailSender = new NodemailerEmailSender();
export const pendingRegistrationStore = new RedisPendingRegistrationStore();
export const imageUploadService = new CloudinaryService();
