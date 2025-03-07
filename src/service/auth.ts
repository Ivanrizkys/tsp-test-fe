import { KyInstance } from "@/config/ky";
import type { LoginRequestBody, LoginResponse } from "@/types/auth";
import type { Response } from "@/types/response";
import { type DefaultError, useMutation } from "@tanstack/react-query";
import { HTTPError } from "ky";

export const useLoginMutation = () => {
	return useMutation<Response<LoginResponse>, DefaultError, LoginRequestBody>({
		mutationFn: async (data) => {
			try {
				return await KyInstance(false)
					.post("auth/login", { json: data })
					.json();
			} catch (error) {
				if (error instanceof HTTPError) {
					try {
						const jsonError = await error.response.json<Response<null>>();
						throw new Error(jsonError.meta.message);
					} catch (error) {
						throw new Error(
							(error as string | undefined) ?? "Login failed, please try again",
						);
					}
				}
				throw new Error("Login failed");
			}
		},
	});
};
