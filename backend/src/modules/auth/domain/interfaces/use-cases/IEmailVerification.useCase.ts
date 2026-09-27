export interface IEmailVerificationUseCase<I,O> {
    execute(input: I): Promise<O>
}
