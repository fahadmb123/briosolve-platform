
export type RegisterCustomerOutput = {
    id:string,
    name:string,
    email:string,
    phone:string | null
}

export type RegisterCustomerInput = {
    name:string,
    email:string,
    password:string,
    phone?:string | null
}