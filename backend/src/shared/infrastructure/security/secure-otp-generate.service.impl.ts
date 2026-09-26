import { randomInt } from "crypto";
import { IOtpGenerator } from "../../application/interfaces/services/otp-generator.service.js";


export class SecureOtpGeneratorServiceImpl implements IOtpGenerator {
    generate(): string {
        return randomInt(100000, 1000000).toString();
    }
}