export interface IResetPasswordUseCase<I,O> {
    execute(input: I): Promise<O>
}
