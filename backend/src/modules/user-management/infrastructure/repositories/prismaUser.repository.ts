import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { getCustomersDto } from "../../application/Dto/getCustomersDto.js";
import { User } from "../../domain/entities/user.entity.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";


import { UserMapper } from "../mappers/user.mapper.js";
import { UpdateUserRepositoryInput } from "../../application/Dto/userDto.js";

type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export class UserRepository implements IUserRepository{
    async getCustomers(input:getCustomersDto): Promise<{users:User[],total:number}> {

        const {page,search,limit,filter} = input

        const skip = (page - 1) * limit

        let query = await db.orm.public.users.where({role:"CUSTOMER"})

        if (search){
            query = query.where((user)=> user.email.ilike(`${search}%`))
        }
        if (filter){
            query = query.where((user)=> user.status.eq(filter as UserStatus))
        }

        const users  = await query
            .orderBy((user)=>user.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()

        const total = await query.aggregate((agg)=>({total:agg.count()}))
        return {
            users: users.map(user => UserMapper.toDomain(user)),
            total:total.total
        }
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