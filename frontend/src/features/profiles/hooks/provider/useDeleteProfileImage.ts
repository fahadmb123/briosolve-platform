import { useMutation } from "@tanstack/react-query";
import { deleteProfileImage } from "../../services/providerProfile.service";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useDeleteProfileImage = () => {
    return useMutation({
        mutationFn: deleteProfileImage,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
