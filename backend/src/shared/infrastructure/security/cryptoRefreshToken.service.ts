import crypto from "crypto";
import { IRefreshTokenService } from "../../domain/interfaces/IRefreshToken.service";

export class CryptoRefreshTokenService implements IRefreshTokenService {
    generateToken(): string {
        return crypto.randomBytes(32).toString("hex");
    }

    hashToken(token: string): string {
        return crypto.createHash("sha256").update(token).digest("hex");
    }
}
