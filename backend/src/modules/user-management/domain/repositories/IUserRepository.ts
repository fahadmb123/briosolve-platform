import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { UpdateUserStatusDto, UpdateUserRepositoryInput } from "../../application/Dto/userDto";
import { User } from "../entities/user.entity";

export type GetUsersWithRoleInput = {
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  page: number;
  limit: number;
  search?: string;
  filter?: string;
};

export interface IUserRepository extends BaseRepository<User | null>{
  getUsersWithRole(input: GetUsersWithRoleInput): Promise<{ users: User[]; total: number }>;
  updateStatus(id:string,status:string):Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserRepositoryInput): Promise<User>;
}