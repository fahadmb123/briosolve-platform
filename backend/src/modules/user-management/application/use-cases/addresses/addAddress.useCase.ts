import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IAddressRepository } from "../../../domain/repositories/IAddressRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AddAddressInputUseCaseDto } from "../../dtos/request/address/add-address.dto";
import { AddressResponseDto } from "../../dtos/response/address/address.dto";


export class AddAddressUseCase implements IUseCase<AddAddressInputUseCaseDto,AddressResponseDto>{
    constructor(
        private readonly _addressRepository: IAddressRepository,
        private readonly _userRepository: IUserRepository
    ){}
    async execute(data: AddAddressInputUseCaseDto): Promise<AddressResponseDto> {
        const user = await this._userRepository.findById(data.id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")
       
        const address = await this._addressRepository.addAddress(data.id,data.input)

        if (!address) throw new ApplicationError("FAILED","Failed to add address","INTERNAL")

        if (!user.current_address_id) await this._userRepository.update(data.id, { current_address_id: address.id })

        return address
    }
}