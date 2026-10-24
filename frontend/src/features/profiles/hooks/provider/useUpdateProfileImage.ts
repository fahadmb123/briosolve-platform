import { useMutation } from "@tanstack/react-query";
import { uploadProfileImage } from "../../services/providerProfile.service";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';

export const useUpdateProfileImage = () => {
    return useMutation({
        mutationFn: uploadProfileImage,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
