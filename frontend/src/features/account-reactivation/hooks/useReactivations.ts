import { useQuery } from "@tanstack/react-query";
import { getReactivationsService, type GetReactivationsQuery } from "../services/reactivation.service";

export const useGetReactivations = (query: GetReactivationsQuery) => {
  return useQuery({
    queryKey: ["reactivations", query],
    queryFn: () => getReactivationsService(query),
  });
};
