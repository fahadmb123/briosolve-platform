import { UpdateUserStatusDto } from "../../../Dto/userDto";

export interface IUpdateUserStatusUseCase {
    execute(input:UpdateUserStatusDto):Promise<void>
}