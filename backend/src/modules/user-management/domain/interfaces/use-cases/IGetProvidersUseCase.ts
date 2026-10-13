import { getProvidersDto } from "../../../application/Dto/getProvidersDto.js";
import { User } from "../../entities/user.entity.js";

export interface IGetProvidersUseCase {
    execute(input: getProvidersDto): Promise<{ users: User[]; total: number; totalPages: number }>;
}
