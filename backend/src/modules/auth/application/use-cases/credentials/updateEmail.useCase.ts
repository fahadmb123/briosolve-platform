import { randomUUID } from "node:crypto"
import { ApplicationError } from "../../../../../shared/application/errors/applicationError"
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase"

import { IUserRepository } from "../../../domain/repositories/user.repository"
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service"
import { IOtpGenerator } from "../../../../../shared/application/interfaces/services/IOtpGenerator.service"
import { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store"
import { IEmailSender } from "../../../../../shared/application/interfaces/services/IEmailSender.service"
import { UpdateEmailUseCaseOutputDto } from "../../dto/response/update-email.dto"
import { UpdateEmailUseCaseInputDto } from "../../dto/request/update-email.dto"







export default class UpdateEmailUseCase implements IUseCase<UpdateEmailUseCaseInputDto, UpdateEmailUseCaseOutputDto> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly otpGenerate: IOtpGenerator,
        private readonly PendingRegistrationStore: IPendingRegistrationStore,
        private readonly EmailSender: IEmailSender
    ) { }

    async execute(input: UpdateEmailUseCaseInputDto): Promise<UpdateEmailUseCaseOutputDto> {

        const user = await this.userRepository.findById(input.userId)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")

        if (user?.email === input.email) throw new ApplicationError("ALREADY_VERIFIED", "Already verified", "CONFLICT")

        const isEmailExist = await this.userRepository.findByEmail(input.email)
        
        if (isEmailExist) throw new ApplicationError("USER_ALREADY_EXIST", "User with email already exist", "CONFLICT")
        
        const otp = this.otpGenerate.generate()
        const otpHash = await this.passwordHasher.hash(otp)

        const registrationId = randomUUID()

        const registrationTtl = 10 * 60
        const otpExpiresIn = 60
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000

        const path = "settings"

        const forPath = "UPDATE"

        await this.PendingRegistrationStore.save(registrationId, {
            name: "",
            email: input.email,
            otpHash,
            attempts: 0,
            path,
            otpExpiresAt,
            for: forPath,
            userId: input.userId
        },
            registrationTtl
        )


        await this.EmailSender.sendOtp(input.email, otp)

        return { registrationId, expiresIn: otpExpiresIn }
    }
}