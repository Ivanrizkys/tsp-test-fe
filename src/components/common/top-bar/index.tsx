import { CircleUser, Menu, Newspaper, Package2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserRole } from "@/enums/user";
import { useUserStore } from "@/store/user";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export default function TopBar() {
	const { setUser, user } = useUserStore((state) => state);

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const handleLogOut = () => {
		queryClient.resetQueries();
		toast("Logged Out Successfully", {
			description: "You have been logged out. See you next time!",
		});
		navigate("/auth/login");
		setTimeout(() => {
			Cookies.remove("token");
			setUser(null);
		}, 300);
	};

	return (
		<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
			<nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
				<Link
					to="/"
					className="flex items-center gap-2 text-lg font-semibold md:text-base"
				>
					<Newspaper className="h-6 w-6" />
					<span className="sr-only">Acme Inc</span>
				</Link>
				<Link
					to="/"
					className="text-foreground transition-colors hover:text-foreground text-nowrap"
				>
					Work Orders
				</Link>
				{user?.role === UserRole.PRODUCTION_MANAGER && (
					<Link
						to="/operator-report"
						className="text-muted-foreground transition-colors hover:text-foreground text-nowrap"
					>
						Operator Report
					</Link>
				)}
			</nav>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<nav className="grid gap-6 text-lg font-medium p-4">
						<Link
							to="/"
							className="flex items-center gap-2 text-lg font-semibold"
						>
							<Package2 className="h-6 w-6" />
							<span className="sr-only">Acme Inc</span>
						</Link>
						<Link to="/" className="hover:text-foreground">
							Work Orders
						</Link>
						<Link
							to="/operator-report"
							className="text-muted-foreground hover:text-foreground"
						>
							Operator Report
						</Link>
					</nav>
				</SheetContent>
			</Sheet>
			<div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							size="icon"
							className="rounded-full ml-auto"
						>
							<CircleUser className="h-5 w-5" />
							<span className="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Settings</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogOut}>Logout</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
