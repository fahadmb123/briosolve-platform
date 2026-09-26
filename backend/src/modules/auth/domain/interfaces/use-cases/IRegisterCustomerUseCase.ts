export interface IRegisterCustomerUseCase<I,O> {
    execute(input: I): Promise<O>
}
