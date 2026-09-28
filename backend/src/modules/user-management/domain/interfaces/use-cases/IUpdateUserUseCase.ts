import { UpdateUserStatusDto } from "../../../application/Dto/userDto.js";

export interface IUpdateUserStatusUseCase {
    execute(input:UpdateUserStatusDto):Promise<void>
}