import { Address } from "../../domain/entities/address.entity.js"

export type AddAddressInputUseCaseDto = {
    id:string
    input: Omit<Address, 'id' | 'created_at' | 'updated_at' | "user_id">
}




export type GetAddressesOutputDto = {
    addresses:Address[]
    total:number,
    totalPages:number
}

export type GetAddressesInputDto = {
    id:string;
    page:number;
    limit:number;
    search?:string;
}



export type EditAddressInputUseCaseDto = {
    id:string
    input: Omit<Address, 'id' | 'created_at' | 'updated_at' | "user_id">
}


export type SetDefaultAddressInputUseCaseDto = {
    userId:string,
    addressId:string
}
