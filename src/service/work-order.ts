import { KyInstance } from "@/config/ky";
import type { Response, ResponseMetaPagination } from "@/types/response";
import type {
	CreateWorkOrderRequestBody,
	CreateWorkOrderResponse,
	GetWorkOrderDetailResponse,
	GetWorkOrderParams,
	GetWorkOrderStatusResponse,
	GetWorkOrdersResponse,
} from "@/types/work-order";
import {
	type DefaultError,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { HTTPError } from "ky";

export const useGetWorkOrders = ({
	page,
	per_page,
	created_at,
	status_id,
}: GetWorkOrderParams) => {
	const params: Record<string, string | number | boolean> = {
		page,
		per_page,
		...(created_at ? { created_at: created_at.toISOString() } : {}),
		...(status_id ? { status_id } : {}),
	};

	return useQuery({
		queryKey: ["work-orders", { ...params }],
		queryFn: async () =>
			KyInstance()("work-orders", { searchParams: params }).json<
				Response<GetWorkOrdersResponse[], ResponseMetaPagination>
			>(),
	});
};

export const useGetWorkOrdersDetail = (workOrderId: number, enabled = true) => {
	return useQuery({
		queryKey: ["work-orders-detail", workOrderId],
		queryFn: async () =>
			KyInstance()(`work-orders/${workOrderId}`).json<
				Response<GetWorkOrderDetailResponse>
			>(),
		enabled,
	});
};

export const useGetWorkOrderStatus = () => {
	return useQuery({
		queryKey: ["work-order-status"],
		queryFn: async () =>
			KyInstance()("work-orders/status").json<
				Response<GetWorkOrderStatusResponse[]>
			>(),
	});
};

export const useCreateWorkOrderMutation = () => {
	return useMutation<
		Response<CreateWorkOrderResponse>,
		DefaultError,
		CreateWorkOrderRequestBody
	>({
		mutationFn: async (data) => {
			try {
				return await KyInstance()
					.post("work-orders", {
						json: {
							...data,
							due_date: data.due_date.toISOString(),
						},
					})
					.json();
			} catch (error) {
				if (error instanceof HTTPError) {
					try {
						const jsonError = await error.response.json<Response<null>>();
						throw new Error(jsonError.meta.message);
					} catch (error) {
						throw new Error(
							(error as string | undefined) ??
								"Create work order failed, please try again",
						);
					}
				}
				throw new Error("Create work order failed");
			}
		},
	});
};
