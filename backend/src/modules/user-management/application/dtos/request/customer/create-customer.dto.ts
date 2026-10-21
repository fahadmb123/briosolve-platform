export type CreateCustomerInputDto = {
    name:string,
    email:string,
    passwordHash:string,
    otpHash:string,
    attempts:number
}