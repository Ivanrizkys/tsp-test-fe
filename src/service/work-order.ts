import { KyInstance } from "@/config/ky";
import type { Response, ResponseMetaPagination } from "@/types/response";
import type {
	CreateWorkOrderRequestBody,
	CreateWorkOrderResponse,
	DeleteWorkOrderBulkRequestBody,
	DeleteWorkOrderRequestParams,
	DeleteWorkOrderResponse,
	GetOperatorWorkOrderOperatorReport,
	GetWorkOrderDetailResponse,
	GetWorkOrderParams,
	GetWorkOrderStatusResponse,
	GetWorkOrdersResponse,
	UpdateWorkOrderManagerRequest,
	UpdateWorkOrderOperatorRequest,
} from "@/types/work-order";
import {
	type DefaultError,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { endOfDay } from "date-fns";
import { HTTPError } from "ky";

export const useGetWorkOrders = ({
	page,
	per_page,
	created_at,
	status_id,
}: GetWorkOrderParams) => {
	let createdAtResult = created_at;
	if (createdAtResult) {
		createdAtResult = endOfDay(createdAtResult);
	}

	const params: Record<string, string | number | boolean> = {
		page,
		per_page,
		...(createdAtResult ? { created_at: createdAtResult.toISOString() } : {}),
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

export const useGetWorkOrderOperatorReport = () => {
	return useQuery({
		queryKey: ["work-order-operator-report"],
		queryFn: async () =>
			KyInstance()("work-orders/operator-report").json<
				Response<GetOperatorWorkOrderOperatorReport[]>
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

export const useUpdateWorkOrderManagerMutation = () => {
	return useMutation<
		Response<null>,
		DefaultError,
		UpdateWorkOrderManagerRequest
	>({
		mutationFn: async (data) => {
			try {
				return await KyInstance()
					.patch(`work-orders/${data.work_order_id}/manager-update`, {
						json: data,
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
								"Update work order manager failed, please try again",
						);
					}
				}
				throw new Error("Update work order manager failed");
			}
		},
	});
};

export const useUpdateWorkOrderOperatorMutation = () => {
	return useMutation<
		Response<null>,
		DefaultError,
		UpdateWorkOrderOperatorRequest
	>({
		mutationFn: async (data) => {
			try {
				return await KyInstance()
					.patch(`work-orders/${data.work_order_id}/operator-update`, {
						json: data,
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
								"Update work order operator failed, please try again",
						);
					}
				}
				throw new Error("Update work order operator failed");
			}
		},
	});
};

export const useDeleteWorkOrderBulkMutation = () => {
	return useMutation<
		Response<DeleteWorkOrderResponse[]>,
		DefaultError,
		DeleteWorkOrderBulkRequestBody
	>({
		mutationFn: async (data) => {
			try {
				return await KyInstance()
					.delete("work-orders/bulk", {
						json: data,
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
								"Delete work order bulk failed, please try again",
						);
					}
				}
				throw new Error("Delete work order bulk failed");
			}
		},
	});
};

export const useDeleteWorkOrderMutation = () => {
	return useMutation<
		Response<DeleteWorkOrderResponse[]>,
		DefaultError,
		DeleteWorkOrderRequestParams
	>({
		mutationFn: async (data) => {
			try {
				return await KyInstance()
					.delete(`work-orders/${data.work_order_id}`, {
						json: data,
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
								"Delete work order failed, please try again",
						);
					}
				}
				throw new Error("Delete work order failed");
			}
		},
	});
};
