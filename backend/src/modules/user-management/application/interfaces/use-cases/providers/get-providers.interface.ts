import { User } from "../../../../domain/entities/user.entity";
import { getProvidersDto } from "../../../dtos/request/provider/get-providers.dto";

export interface IGetProvidersUseCase {
    execute(input: getProvidersDto): Promise<{ users: User[]; total: number; totalPages: number }>;
}
