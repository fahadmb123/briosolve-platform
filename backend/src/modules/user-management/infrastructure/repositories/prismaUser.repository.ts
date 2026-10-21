import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository, GetUsersWithRoleInput } from "../../domain/repositories/IUserRepository";
import { UserMapper } from "../mappers/user.mapper";
import { UpdateUserRepositoryInput } from "../../application/dtos/request/user/update-user-repository.dto";


type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export class UserRepository implements IUserRepository{
    async getUsersWithRole(input: GetUsersWithRoleInput): Promise<{ users: User[], total: number }> {
        const { role, page, search, limit, filter } = input;
        const skip = (page - 1) * limit;

        let query = db.orm.public.users.where({ role });

        if (role === "PROVIDER") {
            query = query.include("provider_profile");
        } else if (role === "CUSTOMER") {
            query = query.include("customer_profile");
        }

        if (search) {
            query = query.where((user) => user.email.ilike(`${search}%`));
        }
        if (filter) {
            query = query.where((user) => user.status.eq(filter as UserStatus));
        }

        const users = await query
            .orderBy((user) => user.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all();

        const total = await query.aggregate((agg) => ({ total: agg.count() }));
        return {
            users: users.map(user => UserMapper.toDomain(user)),
            total: total.total
        };
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await db.orm.public.users.where({email:email as Varchar<255>}).first()
        if (!user) return null
        return UserMapper.toDomain(user)
    }
    

    async findById(id:string):Promise<User | null>{
        const data = await db.orm.public.users.where({id}).include("current_address").first()
        if (!data) return null
      
        return UserMapper.toDomain(data)
    }
    async updateStatus(id:string,status:string):Promise<void>{
        await db.orm.public.users.where({id}).update({status:status as UserStatus})
    }
    async update(id:string,data:UpdateUserRepositoryInput):Promise<User>{
        await db.orm.public.users.where({id: id as Varchar<255>}).update(data as never)
        const updatedUser = await this.findById(id)
        if (!updatedUser) throw new Error("User not found after update")
        return updatedUser
    }
}