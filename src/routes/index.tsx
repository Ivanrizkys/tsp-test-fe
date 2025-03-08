import PrivateRoute from "@/components/layout/private-route";
import { UserRole } from "@/enums/user";
import Login from "@/pages/login";
import type { User } from "@/store/user";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const WorkOrders = lazy(() => import("@/pages/work-orders"));
const CreateWorkOrder = lazy(() => import("@/pages/works-orders-create"));
const WorkOrdersDetail = lazy(() => import("@/pages/work-orders-detail"));

export function getRoutes(user: User | null) {
	return createBrowserRouter([
		{
			element: <PrivateRoute />,
			children: [
				{
					path: "/",
					element: <WorkOrders />,
				},
				{
					path: "/work-orders/:workOrderId",
					element: <WorkOrdersDetail />,
				},
				...(user?.role === UserRole.PRODUCTION_MANAGER
					? [
							{
								path: "/work-orders/create",
								element: <CreateWorkOrder />,
							},
							{
								path: "/operator-report",
								element: <div>Hai sayang</div>,
							},
						]
					: []),
			],
		},
		{
			path: "/auth/login",
			element: <Login />,
		},
	]);
}
