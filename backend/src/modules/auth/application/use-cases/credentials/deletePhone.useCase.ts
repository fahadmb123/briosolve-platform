import { ApplicationError } from "../../../../../shared/application/errors/applicationError"
import { IUseCase } from "../../../../../shared/domain/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";





export class DeletePhoneUseCase implements IUseCase<string,void>{
    constructor (
        private readonly userRepository : IUserRepository
    ){}
    async execute(id:string):Promise<void>{
        const user = await this.userRepository.findById(id)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")
            
        await this.userRepository.update(id, {phone:null})

        return
    }
}