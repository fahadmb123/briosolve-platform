export interface IOtpVarificationUseCase<I,O> {
    execute(input: I): Promise<O>
}
