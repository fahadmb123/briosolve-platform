import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { Address } from "../../domain/entities/address.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { AddAddressInputUseCaseDto } from "../Dto/addressDto.js";


export class DeleteAddressUseCase implements IUseCase<string,void>{
    constructor(
        private readonly addressRepository:IAddressRepository
    ){}
    async execute(id:string): Promise<void> {
        await this.addressRepository.delete(id)
        return
    }
}