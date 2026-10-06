import { randomUUID } from "node:crypto";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError.js";
import { IOtpGenerator } from "../../../../../shared/domain/interfaces/IOtpGenerator.service.js";
import { IPasswordHasher } from "../../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { ISmsService } from "../../../../../shared/domain/interfaces/ISms.service.js";
import { IUseCase } from "../../../domain/interfaces/use-cases/IUseCase.js";
import { SendSmsOtpUseCaseInputDto, SendSmsOtpUseCaseOutputDto } from "../../dto/authDto.js";
import { IPendingRegistrationStore } from "../../../../../shared/domain/interfaces/IPendingRegistration-store.js";
import { IUserRepository } from "../../../domain/repositories/user.repository.js";





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