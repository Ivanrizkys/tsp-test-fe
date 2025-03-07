import PrivateRoute from "@/components/layout/private-route";
import Login from "@/pages/login";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const WorkOrders = lazy(() => import("@/pages/work-orders"));

export function getRoutes() {
	return createBrowserRouter([
		{
			element: <PrivateRoute />,
			children: [
				{
					path: "/",
					element: <WorkOrders />,
				},
			],
		},
		{
			path: "/auth/login",
			element: <Login />,
		},
	]);
}
