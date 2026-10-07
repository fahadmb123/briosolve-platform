import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { SetDefaultAddressInputUseCaseDto } from "../Dto/addressDto.js";


export class SetDefaultAddressUseCase implements IUseCase<SetDefaultAddressInputUseCaseDto,void>{
    constructor(
        private readonly userRespository:IUserRepository
    ){}
    async execute(input:SetDefaultAddressInputUseCaseDto): Promise<void> {
        await this.userRespository.update(input.userId,{current_address_id:input.addressId})
        return
    }
}