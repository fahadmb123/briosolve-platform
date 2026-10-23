import { ApplicationError } from "../../../../../shared/application/errors/applicationError"
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";





export class DeletePhoneUseCase implements IUseCase<string,void>{
    constructor (
        private readonly _userRepository: IUserRepository
    ){}
    async execute(id:string):Promise<void>{
        const user = await this._userRepository.findById(id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")
            
        await this._userRepository.update(id, {phone:null})

        return
    }
}