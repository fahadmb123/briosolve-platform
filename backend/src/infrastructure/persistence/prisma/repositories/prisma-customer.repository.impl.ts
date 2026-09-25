import { Customer } from "../../../../domain/entities/customer/customer-auth.entity.js";
import { CustomerAuthRepository,RegisterCustomerInput } from "../../../../domain/repositories/customer.repository.js";
import { db } from "../client.js";

export class PrismaCustomerAuthRepositoryImpl implements CustomerAuthRepository{
    
    async findByEmail(email: string): Promise<Customer | null> {
        return null;
    }

    async createCustomer( data:RegisterCustomerInput ): Promise<Customer> {
        // @ts-ignore - Prisma 8 rc types evaluate to never due to excessive depth in arktype
        const user = await db.orm.public.users.create({
            name: data.name,
            email: data.email,
            password_hash: data.password,
            role: "CUSTOMER" as const,
            status: "ACTIVE" as const,
            email_verified: false,
            phone_verified: false,
            created_at: new Date(),
            updated_at: new Date(),
        })

        await db.orm.public.customer_profiles.create({
            user_id: user.id,
            created_at: new Date(),
            updated_at: new Date(),
        })

        return new Customer(
            user.id,
            user.name,
            user.email,
            user.phone
        )
    }
}