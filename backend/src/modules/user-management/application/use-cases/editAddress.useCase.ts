import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { Address } from "../../domain/entities/address.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { EditAddressInputUseCaseDto } from "../Dto/addressDto.js";


export class EditAddressUseCase implements IUseCase<EditAddressInputUseCaseDto,Address>{
    constructor(
        private readonly addressRepository:IAddressRepository
    ){}
    async execute(data: EditAddressInputUseCaseDto): Promise<Address> {
        const address = await this.addressRepository.update(data.id,data.input)

        if (!address) throw new ApplicationError("FAILED","Failed to update","INTERNAL")

        return address
    }
}