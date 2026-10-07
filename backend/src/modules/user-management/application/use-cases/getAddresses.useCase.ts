import { Address } from "../../domain/entities/address.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js"
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js"
import { GetAddressesInputDto, GetAddressesOutputDto } from "../Dto/addressDto.js";


export class GetAddressesUseCase implements IUseCase<GetAddressesInputDto,GetAddressesOutputDto>{
    constructor(
        private readonly addressRepository:IAddressRepository,
    ){}
    async execute(data:GetAddressesInputDto): Promise<GetAddressesOutputDto> {
        const response = await this.addressRepository.getAddresses(data)

        if (!response) throw new ApplicationError("FAILED","Failed to get addresses","INTERNAL")

        const totalPages = Math.ceil(response.total / data.limit)
        return {
            addresses: response.addresses,
            total: response.total,
            totalPages
        }
    }
}