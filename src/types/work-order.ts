export interface GetWorkOrderParams {
	created_at?: Date;
	page: number;
	per_page: number;
	status_id?: number;
}
export interface GetWorkOrdersResponse {
	actual_completion_date: Date | null;
	created_at: Date;
	current_status: {
		id: number;
		name: string;
	};
	due_date: Date;
	expected_quantity: number;
	id: number;
	operator: {
		id: number;
		name: string;
	};
	order_number: string;
	product_name: string;
	updated_at: Date;
}

export interface GetWorkOrderDetailResponse {
	actual_completion_date: Date | null;
	actual_quantity: null | number;
	created_at: Date;
	current_status: {
		id: number;
		name: string;
		uuid: string;
	};
	due_date: Date;
	expected_quantity: number;
	id: number;
	in_progress_history: {
		created_at: Date;
		created_by: {
			id: number;
			name: string;
			role_id: number;
		};
		id: number;
		name: string;
		uuid: string;
	}[];
	operator: {
		id: number;
		name: string;
	};
	order_number: string;
	product_name: string;
	status_history: {
		created_at: Date;
		created_by: {
			id: number;
			name: string;
		};
		execute_time_seconds: null | number;
		id: number;
		note: null | string;
		quantity_produced: null | number;
		status_id: number;
		uuid: string;
	}[];
	updated_at: Date;
}

export interface GetWorkOrderStatusResponse {
	created_at: Date;
	id: number;
	name: string;
	updated_at: Date;
	uuid: string;
}

export interface CreateWorkOrderRequestBody {
	due_date: Date;
	expected_quantity: number;
	note?: string;
	operator_id: number;
	product_name: string;
}
export interface CreateWorkOrderResponse {
	actual_completion_date: Date | null;
	created_at: Date;
	current_status: {
		id: number;
		name: string;
	};
	due_date: Date;
	expected_quantity: number;
	id: number;
	operator: {
		id: number;
		name: string;
	};
	order_number: string;
	product_name: string;
	updated_at: Date;
}

export interface UpdateWorkOrderManagerRequest {
	in_progress_state?: string;
	note?: string;
	operator_id: number;
	quantity_produced: number;
	status_id: number;
	work_order_id: number;
}
export interface UpdateWorkOrderOperatorRequest {
	in_progress_state?: string;
	note?: string;
	quantity_produced: number;
	status_id: number;
	work_order_id: number;
}

export interface DeleteWorkOrderBulkRequestBody {
	work_order_ids: number[];
}
export interface DeleteWorkOrderRequestParams {
	work_order_id: number;
}

export interface DeleteWorkOrderResponse {
	actual_completion_date: Date;
	created_at: Date;
	due_date: Date;
	expected_quantity: number;
	id: number;
	order_number: string;
	product_name: string;
	updated_at: Date;
}

export interface GetOperatorWorkOrderOperatorReport {
	canceled_count: number;
	completed_count: number;
	email: string;
	id: number;
	in_progress_count: number;
	name: string;
	pending_count: number;
	total_count: number;
	uuid: string;
}
