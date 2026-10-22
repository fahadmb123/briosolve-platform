import { apiClient } from '../../../../shared/api/Client';
import type { response } from '../../../../shared/types/Dtos';
import type { IAuthUser } from '../../stores/auth.store';
import type { ProviderRegistrationInputType } from '../../schemas/provider/providerRegistration.schema';

export const registerProvider = async (data: { services: string[], experience: string, bio: string }): Promise<response<IAuthUser>> => {
    const response = await apiClient.post("/api/provider/register", data);
    return response.data;
};

export const preRegisterProvider = async (data: Pick<ProviderRegistrationInputType, "fullName" | "email" | "password" | "businessName">): Promise<response<{ expiresIn: number }>> => {
    const response = await apiClient.post("/api/provider/pre-register", data);
    return response.data;
};
