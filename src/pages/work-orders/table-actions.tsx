import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Row } from "@tanstack/react-table";
import { Link } from "react-router";

interface WorkOrderTableActionsProps<TData> {
	row: Row<TData>;
	workOrderId: number;
}

export default function WorkOrderTableActions<TData>({
	workOrderId,
}: WorkOrderTableActionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<DotsHorizontalIcon className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				<DropdownMenuItem>
					<Link to={`/work-orders/update/${workOrderId}`} className="w-full">
						Edit
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link to={`/work-orders/${workOrderId}`} className="w-full">
						View
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					Delete
					<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
