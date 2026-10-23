import { randomUUID } from "node:crypto"
import { ApplicationError } from "../../../../../shared/application/errors/applicationError"
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase"

import { IUserRepository } from "../../../domain/repositories/user.repository"
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service"
import { IOtpGenerator } from "../../../../../shared/application/interfaces/services/IOtpGenerator.service"
import { IPendingRegistrationStore } from "../../../../../shared/application/interfaces/IPendingRegistration-store"
import { IEmailSender } from "../../../../../shared/application/interfaces/services/IEmailSender.service"
import { UpdateEmailUseCaseOutputDto } from "../../dtos/response/update-email.dto"
import { UpdateEmailUseCaseInputDto } from "../../dtos/request/update-email.dto"







export default class UpdateEmailUseCase implements IUseCase<UpdateEmailUseCaseInputDto, UpdateEmailUseCaseOutputDto> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _otpGenerate: IOtpGenerator,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore,
        private readonly _emailSender: IEmailSender
    ) { }

    async execute(input: UpdateEmailUseCaseInputDto): Promise<UpdateEmailUseCaseOutputDto> {

        const user = await this._userRepository.findById(input.userId)

        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not Found","NOT_FOUND")

        if (user?.email === input.email) throw new ApplicationError("ALREADY_VERIFIED", "Already verified", "CONFLICT")

        const isEmailExist = await this._userRepository.findByEmail(input.email)
        
        if (isEmailExist) throw new ApplicationError("USER_ALREADY_EXIST", "User with email already exist", "CONFLICT")
        
        const otp = this._otpGenerate.generate()
        const otpHash = await this._passwordHasher.hash(otp)

        const registrationId = randomUUID()

        const registrationTtl = 10 * 60
        const otpExpiresIn = 60
        const otpExpiresAt = Date.now() + otpExpiresIn * 1000

        const path = "settings"

        const forPath = "UPDATE"

        await this._pendingRegistrationStore.save(registrationId, {
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


        await this._emailSender.sendOtp(input.email, otp)

        return { registrationId, expiresIn: otpExpiresIn }
    }
}