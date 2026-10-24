import { useMutation } from "@tanstack/react-query";
import { addAddress, deleteAddress, editAddress, getAddresses, setDefaultAddress } from "../services/address.service";
import type { ApiError } from "../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';

export const useDeleteAddress = () => {
    return useMutation({
        mutationFn: deleteAddress,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useAddAddress = () => {
    return useMutation({
        mutationFn: addAddress,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useEditAddress = () => {
    return useMutation({
        mutationFn: editAddress,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useGetAddresses = () => {
    return useMutation({
        mutationFn: getAddresses,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useSetDefaultAddress = () => {
    return useMutation({
        mutationFn: setDefaultAddress,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
