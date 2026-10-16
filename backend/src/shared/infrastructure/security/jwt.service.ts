import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload, IJwtService } from "../../application/Dto/services/jwtDto.service";
import { envConfig } from "../config/env.config";

export class JwtService implements IJwtService {
    generate(payload: JwtPayload, expiresIn?: string): string {
        const options: SignOptions = {
            expiresIn: (expiresIn || envConfig.ACCESS_TOKEN_EXPIRATION) as SignOptions["expiresIn"]
        };

        return jwt.sign(payload, envConfig.JWT_ACCESS_SECRET, options);
    }

    verify(token: string): JwtPayload {
        return jwt.verify(token, envConfig.JWT_ACCESS_SECRET) as JwtPayload;
    }
}