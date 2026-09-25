import { randomInt } from "crypto";
import { OtpGenerator } from "../../application/interfaces/services/otp-generator.service.js";


export class SecureOtpGeneratorServiceImpl implements OtpGenerator {
    generate(): string {
        return randomInt(100000, 1000000).toString();
    }
}