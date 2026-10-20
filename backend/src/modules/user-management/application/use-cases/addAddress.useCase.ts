import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { Address } from "../../domain/entities/address.entity";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { AddAddressInputUseCaseDto } from "../Dto/addressDto";


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