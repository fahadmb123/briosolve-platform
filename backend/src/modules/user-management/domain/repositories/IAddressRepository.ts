import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { Address } from "../entities/address.entity.js";



export interface IAddressRepository extends BaseRepository<Address | null>{
    findById(id: string): Promise<Address | null> 
    addAddress(id:string,data: Omit<Address, 'id' | 'created_at' | 'updated_at' | "user_id">): Promise<Address>
    getAddresses(id:string): Promise<{addresses:Address[]}> 
}