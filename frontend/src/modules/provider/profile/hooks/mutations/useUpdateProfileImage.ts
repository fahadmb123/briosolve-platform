import { useMutation } from "@tanstack/react-query";
import { uploadProfileImage } from "../../services/profile.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useUpdateProfileImage = () => {
    return useMutation({
        mutationFn: uploadProfileImage,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
