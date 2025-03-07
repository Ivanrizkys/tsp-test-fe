import { Loader2 } from "lucide-react";

export default function PageLoader() {
	return (
		<main className="min-h-dvh w-full flex items-center justify-center">
			<div className="flex flex-col items-center space-y-1">
				<Loader2 className="w-12 h-12 animate-spin text-primary" />
				<p className="text-card-foreground font-semibold">Please Wait</p>
			</div>
		</main>
	);
}
