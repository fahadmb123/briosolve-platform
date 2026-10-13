import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { UpdateUserStatusDto, UpdateUserRepositoryInput } from "../../application/Dto/userDto.js";
import { User } from "../entities/user.entity.js";

export type GetUsersWithRoleInput = {
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  page: number;
  limit: number;
  search?: string;
  filter?: string;
};

export interface IUserRepository extends BaseRepository<User | null>{
  getUsersWithRole(input: GetUsersWithRoleInput): Promise<{ users: User[]; total: number }>;
  findById(id:string):Promise<User | null>;
  updateStatus(id:string,status:string):Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserRepositoryInput): Promise<User>;
}