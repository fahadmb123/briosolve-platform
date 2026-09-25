import bcrypt from "bcrypt";
import { PasswordHasher } from "../../application/interfaces/services/password-hasher.service.js";



export class BcryptPasswordHasherServiceImpl implements PasswordHasher {
    private readonly salt = 12
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.salt)
    }

    async compare(password: string,passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash)
    }
}