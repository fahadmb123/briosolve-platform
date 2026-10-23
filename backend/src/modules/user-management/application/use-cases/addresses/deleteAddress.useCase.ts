import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IAddressRepository } from "../../../domain/repositories/IAddressRepository";


export class DeleteAddressUseCase implements IUseCase<string,void>{
    constructor(
        private readonly _addressRepository: IAddressRepository
    ){}
    async execute(id:string): Promise<void> {
        await this._addressRepository.delete(id)
        return
    }
}