export interface ResponseMeta {
	message: string;
}

export interface ResponseMetaPagination extends ResponseMeta {
	page: number;
	per_page: number;
	total_data: number;
	total_page: number;
}

export interface Response<TData, TMeta = ResponseMeta> {
	data: TData;
	meta: TMeta;
}
