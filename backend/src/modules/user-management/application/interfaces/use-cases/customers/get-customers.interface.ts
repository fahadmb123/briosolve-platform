import { User } from "../../../../domain/entities/user.entity";
import { getCustomersDto } from "../../../dtos/request/customer/get-customers.dto";


export interface IGetCustomersUseCase {
    execute(input:getCustomersDto): Promise<{users:User[],total:number,totalPages:number}>
}
