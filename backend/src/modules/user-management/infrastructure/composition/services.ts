import { RedisPendingRegistrationStore } from "../../../../shared/database/redisPendingRegistration.store";
import { NodemailerEmailSender } from "../../../../shared/services/nodemailerEmail-sender";
import { BcryptPasswordHasherService } from "../../../../shared/services/becryptPasswordHasher.service";
import { SecureOtpGeneratorService } from "../../../../shared/services/secureOtpGenerate.service";
import { S3Service } from "../../../../shared/services/s3.service";

export const passwordHasher = new BcryptPasswordHasherService();
export const otpGenerate = new SecureOtpGeneratorService();
export const emailSender = new NodemailerEmailSender();
export const pendingRegistrationStore = new RedisPendingRegistrationStore();
export const imageUploadService = new S3Service();
