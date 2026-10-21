import { UpdateUserStatusDto } from "../../../dtos/request/user/update-user-status.dto";

export interface IUpdateUserStatusUseCase {
    execute(input:UpdateUserStatusDto):Promise<void>
}