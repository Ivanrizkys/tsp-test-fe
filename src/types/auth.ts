export interface LoginRequestBody {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	user: {
		email: string;
		id: number;
		name: string;
		role: number;
	};
}
