
export type RegisterCustomerOutput = {
    expiresIn:number,
    registrationId:string
}

export type RegisterCustomerInput = {
    name:string,
    email:string,
    password:string,
    phone?:string | null
}