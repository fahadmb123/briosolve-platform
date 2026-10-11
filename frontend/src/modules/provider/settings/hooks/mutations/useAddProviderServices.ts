import { useMutation } from "@tanstack/react-query";
import { addProviderServices } from "../../services/settings.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useAddProviderServices = () => {
    return useMutation({
        mutationFn: addProviderServices,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
