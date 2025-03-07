import { TableCell, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface TableLoaderProps {
	colSpan: number;
}

export default function TableLoader({ colSpan }: TableLoaderProps) {
	return (
		<TableRow className="h-28">
			<TableCell colSpan={colSpan}>
				<div className="flex flex-col space-y-2 items-center justify-center">
					<Loader2 className="w-8 h-8 animate-spin text-primary" />
					Loading
				</div>
			</TableCell>
		</TableRow>
	);
}
