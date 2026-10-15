import { getProvidersDto } from "../../../application/Dto/getProvidersDto";
import { User } from "../../entities/user.entity";

export interface IGetProvidersUseCase {
    execute(input: getProvidersDto): Promise<{ users: User[]; total: number; totalPages: number }>;
}
