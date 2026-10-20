import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { SetDefaultAddressInputUseCaseDto } from "../Dto/addressDto";


export class SetDefaultAddressUseCase implements IUseCase<SetDefaultAddressInputUseCaseDto,void>{
    constructor(
        private readonly userRespository:IUserRepository
    ){}
    async execute(input:SetDefaultAddressInputUseCaseDto): Promise<void> {
        await this.userRespository.update(input.userId,{current_address_id:input.addressId})
        return
    }
}