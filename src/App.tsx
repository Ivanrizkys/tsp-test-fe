import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-providers";
import { getRoutes } from "@/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 0,
		},
	},
});

function App() {
	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={getRoutes()} />
				<Toaster position="top-right" />
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
