import { UserResponseDto } from "../user/user-dto";

export type GetNearbyProvidersOutputDto = {
    users: UserResponseDto[];
    total: number;
    totalPages: number;
    customerRadius: number;
    hasCustomerLocation: boolean;
};
