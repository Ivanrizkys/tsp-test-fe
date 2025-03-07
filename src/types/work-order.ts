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
		created_by: number;
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
