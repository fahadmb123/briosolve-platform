export interface IGetMeUseCase<I,O> {
    execute(input: I): Promise<O>
}
