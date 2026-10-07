import { Address } from "../../domain/entities/address.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js"
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js"


export class GetAddressesUseCase implements IUseCase<string,{addresses:Address[]}>{
    constructor(
        private readonly addressRepository:IAddressRepository,
    ){}
    async execute(id:string): Promise<{addresses:Address[]}> {
        const response = await this.addressRepository.getAddresses(id)

        if (!response) throw new ApplicationError("FAILED","Failed to get addresses","INTERNAL")

        return response as {addresses:Address[]}
    }
}