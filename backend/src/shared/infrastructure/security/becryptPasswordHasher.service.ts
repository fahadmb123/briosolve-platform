import bcrypt from "bcrypt";
import { IPasswordHasher } from "../../domain/interfaces/services/IPasswordHasher.service";



export class BcryptPasswordHasherService implements IPasswordHasher {
    private readonly salt = 12
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.salt)
    }

    async compare(password: string,passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash)
    }
}