import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";
import { getProviderProfile } from "../../services/settings.service";

export const useGetProviderProfile = () => {
    return useMutation({
        mutationFn: getProviderProfile,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
