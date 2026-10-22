import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";

export const useDeleteProfileImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (imageUrl?: string) => {
            const res = await apiClient.delete<response<null>>("/api/customer/profile/image", { data: { imageUrl } });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            import("../../../auth").then(m => m.useAuthStore.getState().fetchUser());
        },
    });
};
