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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { UserRole } from "@/enums/user";
import {
	useDeleteWorkOrderBulkMutation,
	useGetWorkOrderStatus,
	useGetWorkOrders,
} from "@/service/work-order";
import { useUserStore } from "@/store/user";
import type { GetWorkOrdersResponse } from "@/types/work-order";
import { PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import workOrderTableColumns from "./table-columns";
import getWorkOrderTableColumn from "./table-columns";
import WorkOrderTablePagination from "./table-pagination";

const fallbackData: GetWorkOrdersResponse[] = [];

export default function WorkOrders() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [page, setPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(10);
	const [status, setStatus] = useState<string>("0");
	const [createdAt, setCreatedAt] = useState<Date | undefined>();

	const user = useUserStore((state) => state.user);

	const queryClient = useQueryClient();
	const { data: workOrderStatus } = useGetWorkOrderStatus();
	const { mutate: doDeleteWoBulk, isPending: isPendingDeleteWoBulk } =
		useDeleteWorkOrderBulkMutation();
	const { data: workOrders, isPending: isPendingWorkOrder } = useGetWorkOrders({
		page,
		per_page: perPage,
		...(status !== "0" ? { status_id: Number(status) } : {}),
		...(createdAt ? { created_at: createdAt } : {}),
	});

	const table = useReactTable<GetWorkOrdersResponse>({
		data: workOrders?.data ?? fallbackData,
		columns: getWorkOrderTableColumn(user),
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getRowId: (row) => String(row.id),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	const handleDeleteBulk = () => {
		doDeleteWoBulk(
			{
				work_order_ids: Object.keys(rowSelection).map((val) => Number(val)),
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["work-orders"] });
					toast("Work Orders Deleted", {
						description:
							"The selected work orders have been successfully deleted.",
					});
					setRowSelection({});
				},
				onError: (error) => {
					toast.error("Failed to Delete Work Orders", {
						description: ` ${error.message ?? "Unable to delete the selected work orders"}. Please try again later.`,
					});
					import.meta.env.DEV && console.error("Error occured", error);
				},
			},
		);
	};

	return (
		<main className="p-4 md:gap-8 md:p-8">
			<section className="grid sm:flex">
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
					<DayPicker
						placeholder="Created work order"
						buttonClassName="w-[180px] sm:w-[247.92px]"
						date={createdAt}
						setDate={setCreatedAt}
					/>
					{user?.role === UserRole.PRODUCTION_MANAGER && (
						<Link to="/work-orders/create">
							<Button variant="outline">
								<PlusCircledIcon className="mr-0 sm:mr-2 h-4 w-4" />
								<span className="hidden sm:inline">Create New</span>
							</Button>
						</Link>
					)}
					{user?.role === UserRole.PRODUCTION_MANAGER &&
						Object.keys(rowSelection).length > 0 && (
							<Button
								variant="outline"
								onClick={handleDeleteBulk}
								className="text-destructive outline-destructive border-destructive hover:text-destructive"
							>
								<TrashIcon className="h-4 w-4" />{" "}
								<span className="hidden sm:inline">Delete</span>{" "}
								{isPendingDeleteWoBulk && (
									<Loader2 className="w-4 h-4 animate-spin" />
								)}
							</Button>
						)}
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
											colSpan={getWorkOrderTableColumn(user).length}
											className="h-24 text-center"
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</>
						) : (
							<TableLoader colSpan={workOrderTableColumns(user).length} />
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
