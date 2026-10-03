import { randomUUID } from "node:crypto"
import { ApplicationError } from "../../../../../shared/application/errors/applicationError.js"
import { IUseCase } from "../../../domain/interfaces/use-cases/IUseCase.js"
import { UpdateEmailUseCaseInputDto, UpdateEmailUseCaseOutputDto } from "../../dto/customerDto.js"
import { IUserRepository } from "../../../domain/repositories/user.repository.js"
import { IPasswordHasher } from "../../../../../shared/domain/interfaces/IPasswordHasher.service.js"
import { IOtpGenerator } from "../../../../../shared/domain/interfaces/IOtpGenerator.service.js"
import { IPendingRegistrationStore } from "../../../../../shared/domain/interfaces/IPendingRegistration-store.js"
import { IEmailSender } from "../../../../../shared/domain/interfaces/IEmailSender.service.js"







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