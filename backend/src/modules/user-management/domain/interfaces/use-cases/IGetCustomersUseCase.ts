import { getCustomersDto } from "../../../application/Dto/getCustomersDto.js";
import { User } from "../../entities/user.entity.js";


export interface IGetCustomersUseCase {
    execute(input:getCustomersDto): Promise<{users:User[],total:number,totalPages:number}>
}
