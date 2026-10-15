import { Address } from "../../domain/entities/address.entity";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase"
import { IAddressRepository } from "../../domain/repositories/IAddressRepository"
import { ApplicationError } from "../../../../shared/application/errors/applicationError"
import { GetAddressesInputDto, GetAddressesOutputDto } from "../Dto/addressDto";


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