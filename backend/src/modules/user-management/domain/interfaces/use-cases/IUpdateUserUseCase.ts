import { UpdateUserStatusDto } from "../../../application/Dto/userDto";

export interface IUpdateUserStatusUseCase {
    execute(input:UpdateUserStatusDto):Promise<void>
}