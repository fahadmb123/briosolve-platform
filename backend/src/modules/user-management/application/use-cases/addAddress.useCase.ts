import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { Address } from "../../domain/entities/address.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { AddAddressInputUseCaseDto } from "../Dto/addressDto.js";


export class AddAddressUseCase implements IUseCase<AddAddressInputUseCaseDto,Address>{
    constructor(
        private readonly addressRepository:IAddressRepository,
        private readonly userRepository:IUserRepository
    ){}
    async execute(data: AddAddressInputUseCaseDto): Promise<Address> {
        const user = await this.userRepository.findById(data.id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")
       
        const address = await this.addressRepository.addAddress(data.id,data.input)

        if (!address) throw new ApplicationError("FAILED","Failed to add address","INTERNAL")

        if (!user.current_address_id) await this.userRepository.update(data.id, { current_address_id: address.id })

        return address
    }
}