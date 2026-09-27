import { User } from "../../entities/user.entity.js";


export interface IGetCustomersUseCase {
    execute(): Promise<User[]>
}
