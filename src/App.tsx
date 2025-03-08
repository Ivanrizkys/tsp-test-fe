import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-providers";
import { getRoutes } from "@/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { useUserStore } from "./store/user";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
		},
	},
});

function App() {
	const user = useUserStore((state) => state.user);

	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={getRoutes(user)} />
				<Toaster position="top-right" />
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
