import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js";


export class DeleteAddressUseCase implements IUseCase<string,void>{
    constructor(
        private readonly addressRepository:IAddressRepository
    ){}
    async execute(id:string): Promise<void> {
        await this.addressRepository.delete(id)
        return
    }
}