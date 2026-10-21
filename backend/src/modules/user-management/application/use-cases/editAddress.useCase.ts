import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { Address } from "../../domain/entities/address.entity";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { EditAddressInputUseCaseDto } from "../dtos/request/address/edit-address.dto";



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