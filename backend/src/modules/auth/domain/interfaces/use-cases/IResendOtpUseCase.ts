export interface IResendOtpUseCase<I,O> {
    execute(input: I): Promise<O>
}
