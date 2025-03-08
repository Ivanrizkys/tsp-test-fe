import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

interface WorkOrderTablePaginationProps<TData> {
	table: Table<TData>;
	page: number;
	totalPage: number;
	perPage: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	setPerPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function WorkOrderTablePagination<TData>({
	table,
	page,
	totalPage,
	perPage,
	setPage,
	setPerPage,
}: WorkOrderTablePaginationProps<TData>) {
	return (
		<div className="flex items-center justify-between px-2">
			<div className="hidden sm:flex flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{" "}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={String(perPage)}
						onValueChange={(value) => {
							setPerPage(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={perPage} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Page {page} of {totalPage}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => setPage(1)}
						disabled={page === 1}
					>
						<span className="sr-only">Go to first page</span>
						<DoubleArrowLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => setPage((prev) => prev - 1)}
						disabled={page === 1}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeftIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => setPage(totalPage)}
						disabled={page === totalPage}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRightIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => setPage((prev) => prev + 1)}
						disabled={page === totalPage}
					>
						<span className="sr-only">Go to last page</span>
						<DoubleArrowRightIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
