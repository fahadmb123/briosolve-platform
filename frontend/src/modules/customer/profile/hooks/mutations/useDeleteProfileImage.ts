import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../../shared/api/Client";
import { type response } from "../../../../../shared/types/Dtos";

export const useDeleteProfileImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await apiClient.delete<response<null>>("/api/customer/profile/image");
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            import("../../../../../store/auth/auth.store").then(m => m.useAuthStore.getState().fetchUser());
        },
    });
};
