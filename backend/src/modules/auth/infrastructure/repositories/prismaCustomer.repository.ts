import { Varchar } from "@prisma/orm-postgres/target/codec-types"
import { db } from "../../../../shared/database/client"
import { CustomerProfile } from "../../domain/entities/customerProfile.entity"
import { ICustomerRepository } from "../../domain/repositories/customer.respository";
import { User } from "../../domain/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";
import { CustomerProfileMapper } from "../mappers/customerProfile.mapper";
import { RegisterCustomerInput } from "../../application/dtos/request/register-customer.dto";

export class PrismaCustomerRepository implements ICustomerRepository {

    async createCustomer(data: RegisterCustomerInput): Promise<User> {
        return await db.transaction(async (tx) => {
            const user = await tx.orm.public.users.create(
                UserMapper.toPersistence(data, "CUSTOMER") as never
            );

            await tx.orm.public.customer_profiles.create(
                CustomerProfileMapper.toPersistence(user.id) as never
            );

            return UserMapper.toDomain(user);
        });
    }

    async findById(id : string): Promise<CustomerProfile | null> {
        const customer = await db.orm.public.customer_profiles
            .where({user_id:id as Varchar<255>})
            .first()
        
        if (!customer) return null
        
        return CustomerProfileMapper.toDomain(customer)
    }
}
