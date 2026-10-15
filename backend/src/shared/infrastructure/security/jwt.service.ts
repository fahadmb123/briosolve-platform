import jwt from "jsonwebtoken";
import { JwtPayload,IJwtService } from "../../application/Dto/services/jwtDto.service";



export class JwtService implements IJwtService {

    generate(payload: JwtPayload): string {
        const secret = process.env.JWT_SECRET

        if (!secret) throw new Error("JWT_SECRET is not configured")

        return jwt.sign(payload, secret, {
            expiresIn: "5d"
        })
    }

    verify(token: string): JwtPayload {
        const secret = process.env.JWT_SECRET

        if (!secret)  throw new Error("JWT_SECRET is not configured")

        return jwt.verify(token, secret) as JwtPayload
    }
}