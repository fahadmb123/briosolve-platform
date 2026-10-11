import { useMutation } from "@tanstack/react-query";
import { updateBusinessProfile, updateServiceRadius } from "../../services/settings.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useUpdateBusinessProfile = () => {
    return useMutation({
        mutationFn: updateBusinessProfile,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useUpdateServiceRadius = () => {
    return useMutation({
        mutationFn: updateServiceRadius,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
