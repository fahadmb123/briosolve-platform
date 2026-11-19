import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../services/customerProfile.service";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};
