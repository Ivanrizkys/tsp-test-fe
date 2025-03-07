import PrivateRoute from "@/components/layout/private-route";
import Login from "@/pages/login";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const WorkOrders = lazy(() => import("@/pages/work-orders"));
const CreateWorkOrder = lazy(() => import("@/pages/works-orders-create"));
const WorkOrdersDetail = lazy(() => import("@/pages/work-orders-detail"));

export function getRoutes() {
	return createBrowserRouter([
		{
			element: <PrivateRoute />,
			children: [
				{
					path: "/",
					element: <WorkOrders />,
				},
				{
					path: "/work-orders/create",
					element: <CreateWorkOrder />,
				},
				{
					path: "/work-orders/:workOrderId",
					element: <WorkOrdersDetail />,
				},
			],
		},
		{
			path: "/auth/login",
			element: <Login />,
		},
	]);
}
