import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../../shared/api/Client";
import { type response } from "../../../../../shared/types/Dtos";

export const useUpdateProfileImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("image", file);
            const response = await apiClient.post<response<{ profile_image: string }>>("/api/customer/profile/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            // Let the auth store fetch again so header updates
            import("../../../../../store/auth/auth.store").then(m => m.useAuthStore.getState().fetchUser());
        },
    });
};
