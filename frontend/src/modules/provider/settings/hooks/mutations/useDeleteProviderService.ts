import { useMutation } from "@tanstack/react-query";
import { deleteProviderService } from "../../services/settings.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useDeleteProviderService = () => {
    return useMutation({
        mutationFn: deleteProviderService,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
