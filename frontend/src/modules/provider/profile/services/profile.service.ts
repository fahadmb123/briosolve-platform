import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";

export const uploadProfileImage = async (file: File): Promise<response<{ profile_image: string }>> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await apiClient.post<response<{ profile_image: string }>>("/api/provider/profile/image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const deleteProfileImage = async (imageUrl?: string): Promise<response<null>> => {
    const res = await apiClient.delete<response<null>>("/api/provider/profile/image", { data: { imageUrl } });
    return res.data;
};
