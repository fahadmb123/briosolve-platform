import { useMutation } from "@tanstack/react-query";
import { getReactivationsService, type GetReactivationsQuery } from "../services/reactivation.service";

export const useGetReactivations = () => {
  return useMutation({
    mutationFn: (query: GetReactivationsQuery) => getReactivationsService(query),
  });
};
