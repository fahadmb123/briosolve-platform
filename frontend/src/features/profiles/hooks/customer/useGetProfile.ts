import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';
import { getProfile } from "../../services/customerProfile.service";

export const useGetProfile = () => {
    return useMutation({
        mutationFn: getProfile,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
