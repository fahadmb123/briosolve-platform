export interface ILoginUseCase<I,O> {
    execute(input: I): Promise<O>
}
