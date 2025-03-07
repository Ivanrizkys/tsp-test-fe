import PageLoader from "@/components/common/page-loader";
import TopBar from "@/components/common/top-bar";
import useAuth from "@/hooks/use-auth";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router";

export default function PrivateRoute() {
	const auth = useAuth();
	return auth ? (
		<div className="flex min-h-screen w-full flex-col">
			<TopBar />
			<Suspense fallback={<PageLoader />}>
				<Outlet />
			</Suspense>
		</div>
	) : (
		<Navigate to="/auth/login" />
	);
}
