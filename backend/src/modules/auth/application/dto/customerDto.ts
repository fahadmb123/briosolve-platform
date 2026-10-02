
export type EmailVerificationUseCaseOutputDto = {
    expiresIn:number,
    registrationId:string
}
export type EmailVerificationUseCaseInputDto = {
    email:string;
}


export type UpdateEmailUseCaseOutputDto = {
    expiresIn:number,
    registrationId:string
}
export type UpdateEmailUseCaseInputDto = {
    email: string;
    userId: string;
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




type updatePassword = {
    currentPassword : string;
    newPassword : string;
}
export type UpdatePasswordInputDto = {
    id:string,
    data:updatePassword
}

