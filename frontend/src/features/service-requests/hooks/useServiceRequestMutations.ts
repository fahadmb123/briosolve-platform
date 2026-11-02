import { useMutation } from "@tanstack/react-query";
import { createServiceRequest } from "../services/serviceRequest.service";

export const useCreateServiceRequest = () => {
  return useMutation({
    mutationFn: createServiceRequest
  });
};

