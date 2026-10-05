
export type EmailVerificationUseCaseOutputDto = {
    expiresIn:number,
    registrationId:string
}




export type RegisterCustomerInput = {
    name:string,
    email:string,
    password:string,
    phone?:string | null
}
export type CreateCustomerInputDto = {
    name:string,
    email:string,
    passwordHash:string,
    otpHash:string,
    attempts:number
}




export type UpdateCustomerProfileInputDto = {
    id:string,
    data:UpdateCustomerProfileInputDataDto
}

export type UpdateCustomerProfileInputDataDto = {
    name:string,
    about:string
}


