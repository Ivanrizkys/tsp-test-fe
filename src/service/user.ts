import { KyInstance } from "@/config/ky";
import type { Response } from "@/types/response";
import type { GetOperatorsResponse } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useGetOperators = () => {
	return useQuery({
		queryKey: ["operators"],
		queryFn: async () =>
			KyInstance()("users/operators").json<Response<GetOperatorsResponse[]>>(),
	});
};
