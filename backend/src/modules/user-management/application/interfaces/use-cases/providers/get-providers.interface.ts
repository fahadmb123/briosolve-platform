import { getProvidersDto } from "../../../dtos/getProvidersDto";
import { User } from "../../../../domain/entities/user.entity";

export interface IGetProvidersUseCase {
    execute(input: getProvidersDto): Promise<{ users: User[]; total: number; totalPages: number }>;
}
