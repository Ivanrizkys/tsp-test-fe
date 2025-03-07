import Cookies from "js-cookie";
import ky from "ky";
import { toast } from "sonner";

export const KyInstance = (withAuth = true) => {
	return ky.create({
		prefixUrl: import.meta.env.VITE_BASE_API_URL,
		hooks: {
			beforeRequest: [
				(request) => {
					if (withAuth) {
						const token = Cookies.get("token");
						if (!token) {
							window.location.href = "/auth/login";
						}
						request.headers.set("Authorization", `Bearer ${token}`);
					}
				},
			],
			afterResponse: [
				(_request, _options, response) => {
					// if (response.status === 401) {
					// 	window.location.href = "/401";
					// 	toast.error("Unauthorized Access", {
					// 		description:
					// 			"You don't have permission to access this resource. Please log in and try again.",
					// 	});
					// }
					if (response.status === 500) {
						toast.error("Internal Server Error", {
							description:
								"Something went wrong on our end. Please try again later or contact support if the issue persists.",
						});
					}
				},
			],
		},
		retry: {
			limit: 0,
		},
	});
};
