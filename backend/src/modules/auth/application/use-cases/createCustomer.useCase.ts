/*export default class RegisterCustomerUseCaseImpl implements UseCase<void,void> {
    constructor(private readonly customerAuthRepository : CustomerAuthRepository,
        readonly passwordHasher:PasswordHasher,
        readonly otpGenerate:OtpGenerator,
        readonly EmailSender:EmailSender,
        readonly PendingRegistrationStore:PendingRegistrationStore
    ){}

    async execute (input:RegisterCustomerInput):Promise<RegisterCustomerOutput>{
        const isEmailExist = await this.customerAuthRepository.findByEmail(input.email)
        if (isEmailExist) throw new ApplicationError("USER_EMAIL_ALREADY_EXIST","User with email already exist","CONFLICT")

        const otp = this.otpGenerate.generate()

        const passwordHash = await this.passwordHasher.hash(input.password)
        const otpHash = await this.passwordHasher.hash(otp)
        const registrationId  = randomUUID()
        
        await this.PendingRegistrationStore.save(registrationId,{
            name:input.name,
            email:input.email,
            passwordHash,
            otpHash,
            attempts:0},
            60
        )
        
        
        await this.EmailSender.sendOtp(input.email,otp)
    
        return {registrationId,expiresIn: 60}
    }
}*/