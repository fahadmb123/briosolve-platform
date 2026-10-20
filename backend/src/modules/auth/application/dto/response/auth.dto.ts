import { UserResponseDto } from "./user.dto";

export type AuthResponseDto = {
    accessToken: string;
    user: UserResponseDto;
}

