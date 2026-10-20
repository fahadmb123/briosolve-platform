import { randomInt } from "crypto";
import { IOtpGenerator } from "../../application/interfaces/services/IOtpGenerator.service";


export class SecureOtpGeneratorService implements IOtpGenerator {
    generate(): string {
        return randomInt(100000, 1000000).toString();
    }
}