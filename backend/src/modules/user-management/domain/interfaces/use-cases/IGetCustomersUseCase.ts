import { getCustomersDto } from "../../../application/Dto/getCustomersDto";
import { User } from "../../entities/user.entity";


export interface IGetCustomersUseCase {
    execute(input:getCustomersDto): Promise<{users:User[],total:number,totalPages:number}>
}
