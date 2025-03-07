import TableLoader from "@/components/common/data-table-loader";
import { DataTableViewOptions } from "@/components/common/data-table-view-options";
import { DayPicker } from "@/components/common/day-picker";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetWorkOrderStatus, useGetWorkOrders } from "@/service/work-order";
import type { GetWorkOrdersResponse } from "@/types/work-order";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router";
import workOrderTableColumns from "./table-columns";
import WorkOrderTablePagination from "./table-pagination";

const fallbackData: GetWorkOrdersResponse[] = [];

export default function WorkOrders() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [page, setPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(10);
	const [status, setStatus] = useState<string>("0");

	const { data: workOrderStatus } = useGetWorkOrderStatus();
	const { data: workOrders, isPending: isPendingWorkOrder } = useGetWorkOrders({
		page,
		per_page: perPage,
		...(status !== "0" ? { status_id: Number(status) } : {}),
	});

	const table = useReactTable<GetWorkOrdersResponse>({
		data: workOrders?.data ?? fallbackData,
		columns: workOrderTableColumns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<main className="p-4 md:gap-8 md:p-8">
			<section className="flex">
				<div className="flex items-center space-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">Status</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56" align="start">
							<DropdownMenuLabel>Work Order Status</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
								<DropdownMenuRadioItem value="0">All</DropdownMenuRadioItem>
								{workOrderStatus?.data.map((status) => (
									<DropdownMenuRadioItem
										key={status.uuid}
										value={String(status.id)}
									>
										{status.name}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<DayPicker placeholder="Create work order" />
					<Input
						className="w-[150px] lg:w-[350px]"
						placeholder="Insert order number..."
					/>
					<Link to="/work-orders/create">
						<Button variant="outline">
							<PlusCircledIcon className="mr-2 h-4 w-4" /> Create New
						</Button>
					</Link>
				</div>
				<DataTableViewOptions table={table} />
			</section>
			<section className="rounded-md border mt-4">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{!isPendingWorkOrder ? (
							<>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={workOrderTableColumns.length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</>
						) : (
							<TableLoader colSpan={workOrderTableColumns.length} />
						)}
					</TableBody>
				</Table>
			</section>
			<div className="mt-4">
				<WorkOrderTablePagination
					page={page}
					perPage={perPage}
					setPage={setPage}
					setPerPage={setPerPage}
					table={table}
					totalPage={workOrders?.meta.total_page ?? 0}
				/>
			</div>
		</main>
	);
}
