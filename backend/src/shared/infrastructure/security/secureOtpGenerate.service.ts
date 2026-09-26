import { randomInt } from "crypto";
import { IOtpGenerator } from "../../domain/interfaces/IOtpGenerator.service.js";


export class SecureOtpGeneratorService implements IOtpGenerator {
    generate(): string {
        return randomInt(100000, 1000000).toString();
    }
}