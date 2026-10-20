import { User } from "../../../domain/entities/user.entity";

export type LoginOutputDto = {
    accessToken: string;
    refreshToken: string;
    isExist: User;
};
