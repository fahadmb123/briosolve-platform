import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';
import { updateBusinessProfile } from "../../services/providerAuth.service";
import { updateServiceRadius } from "../../../service-catalog";

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
