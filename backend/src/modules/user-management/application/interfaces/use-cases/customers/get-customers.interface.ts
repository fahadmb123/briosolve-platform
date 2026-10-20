import { User } from "../../../../domain/entities/user.entity";
import { getCustomersDto } from "../../../Dto/getCustomersDto";


export interface IGetCustomersUseCase {
    execute(input:getCustomersDto): Promise<{users:User[],total:number,totalPages:number}>
}
