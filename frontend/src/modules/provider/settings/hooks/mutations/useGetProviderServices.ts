import { useMutation } from "@tanstack/react-query";
import { getProviderServices } from "../../services/settings.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useGetProviderServices = () => {
    return useMutation({
        mutationFn: getProviderServices,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
