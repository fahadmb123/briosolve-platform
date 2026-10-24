import { useMutation } from "@tanstack/react-query";
import * as VerificationService from "../../services/verification.service";
import type { ApiError } from "../../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';

export const useGetProviderVerifications = () => {
    return useMutation({
        mutationFn: VerificationService.getProviderVerifications,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useUploadVerificationDocument = () => {
    return useMutation({
        mutationFn: VerificationService.uploadVerificationDocument,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useUpdateVerificationDocument = () => {
    return useMutation({
        mutationFn: VerificationService.updateVerificationDocument,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteVerificationDocument = () => {
    return useMutation({
        mutationFn: VerificationService.deleteVerificationDocument,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
