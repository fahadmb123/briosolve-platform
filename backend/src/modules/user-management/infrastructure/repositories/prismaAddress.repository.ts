import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../infrastructure/persistence/prisma/client.js";
import { Address } from "../../domain/entities/address.entity.js";
import { IAddressRepository } from "../../domain/repositories/IAddressRepository.js";
import { AddressMapper } from "../mappers/address.mapper.js";




export class AddressRepository implements IAddressRepository{
    async findById(id: string): Promise<Address | null> {
        const address = await db.orm.public.addresses
            .where({id})
            .first()
        if (!address) return null
        return AddressMapper.toDomain(address)
    }

    async addAddress(id:string,data: Omit<Address, 'id' | 'created_at' | 'updated_at'>): Promise<Address> {
        const address = await db.orm.public.addresses.create({
            user_id:id,
            house_no: data.house_no,
            area: data.area,
            city: data.city,
            district: data.district,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            landmark: data.landmark,
            type: data.type,
            latitude: data.latitude,
            longitude: data.longitude,
        } as never);

        return AddressMapper.toDomain(address);
    }

    async getAddresses(id:string): Promise<{addresses:Address[]}> {
        const addresses = await db.orm.public.addresses
            .where({user_id:id})
            .all()

        return {
            addresses:addresses.map((address)=> AddressMapper.toDomain(address))
        }
    }
}