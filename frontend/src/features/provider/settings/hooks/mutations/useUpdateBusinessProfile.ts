import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";
import { updateBusinessProfile } from "../../services/auth.service";
import { updateServiceRadius } from "../../services/service-catelog.service";

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
