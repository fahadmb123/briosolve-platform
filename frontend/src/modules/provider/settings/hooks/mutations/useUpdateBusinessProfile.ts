import { useMutation } from "@tanstack/react-query";
import { updateBusinessProfile } from "../../services/settings.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useUpdateBusinessProfile = () => {
    return useMutation({
        mutationFn: updateBusinessProfile,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
