import { IUseCase } from "../../../../shared/domain/interfaces/use-cases/IUseCase";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository";


export class DeleteAddressUseCase implements IUseCase<string,void>{
    constructor(
        private readonly addressRepository:IAddressRepository
    ){}
    async execute(id:string): Promise<void> {
        await this.addressRepository.delete(id)
        return
    }
}