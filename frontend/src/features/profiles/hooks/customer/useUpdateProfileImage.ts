import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";

export const useUpdateProfileImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("image", file);
            const res = await apiClient.post<response<{ profile_image: string }>>("/api/customer/profile/image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            import("../../../auth/stores/auth.store").then(m => m.useAuthStore.getState().fetchUser());
        },
    });
};
