import DataTableColumnHeader from "@/components/common/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/enums/user";
import { WorkOrderStatus } from "@/enums/work-order";
import type { User } from "@/store/user";
import type { GetWorkOrdersResponse } from "@/types/work-order";
import {
	CheckCircledIcon,
	CircleBackslashIcon,
	ClockIcon,
	QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import type { ColumnDef, Row, Table } from "@tanstack/react-table";
import { format } from "date-fns";
import WorkOrderTableActions from "./table-actions";

export default function getWorkOrderTableColumn(user: User | null) {
	const workOrderTableColumns: ColumnDef<GetWorkOrdersResponse>[] = [
		...(user?.role === UserRole.PRODUCTION_MANAGER
			? [
					{
						id: "select",
						header: ({ table }: { table: Table<GetWorkOrdersResponse> }) => (
							<Checkbox
								checked={
									table.getIsAllPageRowsSelected() ||
									(table.getIsSomePageRowsSelected() && "indeterminate")
								}
								onCheckedChange={(value) =>
									table.toggleAllPageRowsSelected(!!value)
								}
								aria-label="Select All"
								className="translate-y-[2px]"
							/>
						),
						cell: ({ row }: { row: Row<GetWorkOrdersResponse> }) => (
							<Checkbox
								checked={row.getIsSelected()}
								onCheckedChange={(value) => row.toggleSelected(!!value)}
								aria-label="Select Row"
								className="translate-y-[2px]"
							/>
						),
						enableSorting: false,
						enableHiding: false,
					},
				]
			: []),
		{
			accessorKey: "product_name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Product Name" />
			),
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2">
						<Badge
							className="text-nowrap"
							variant={
								row.original.expected_quantity > 100 ? "default" : "outline"
							}
						>
							{row.original.expected_quantity} Produk
						</Badge>
						<span className="max-w-[500px] truncate font-medium">
							{row.original.product_name}
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: "order_number",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Order Number" />
			),
			cell: ({ row }) => <div>{row.original.order_number}</div>,
		},
		{
			accessorKey: "current_status",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" sorting={false} />
			),
			cell: ({ row }) => {
				const woStatusId = row.original.current_status.id;
				return (
					<div className="flex items-center gap-2">
						{woStatusId === WorkOrderStatus.PENDING ? (
							<QuestionMarkCircledIcon className="w-4 h-5" />
						) : woStatusId === WorkOrderStatus.IN_PROGRESS ? (
							<ClockIcon className="w-4 h-5" />
						) : woStatusId === WorkOrderStatus.COMPLETED ? (
							<CheckCircledIcon className="w-4 h-4" />
						) : (
							<CircleBackslashIcon className="w-4 h-4" />
						)}
						<p>{row.original.current_status.name}</p>
					</div>
				);
			},
		},
		{
			accessorKey: "due_date",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Due Date" />
			),
			cell: ({ row }) => {
				return (
					<div className="font-medium">
						{format(row.original.due_date, "dd MMMM yyyy, HH:mm")}
					</div>
				);
			},
		},
		{
			accessorKey: "operator",
			accessorFn: (row) => row.operator?.name,
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Operator" />
			),
			cell: ({ row }) => {
				return <div>{row.original.operator.name}</div>;
			},
			enableSorting: false,
		},
		{
			accessorKey: "actual_completion_date",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Actual Completion"
					sorting={false}
				/>
			),
			cell: ({ row }) => {
				return (
					<div className="font-medium">
						{row.original.actual_completion_date ? (
							format(row.original.actual_completion_date, "dd MMMM yyyy, HH:mm")
						) : (
							<Badge variant="destructive" className="text-nowrap uppercase">
								{row.original.current_status.name}
							</Badge>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "created_at",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created At" />
			),
			cell: ({ row }) => {
				return (
					<div className="font-medium">
						{format(row.original.created_at, "dd MMMM yyyy, HH:mm")}
					</div>
				);
			},
		},
		{
			accessorKey: "updated_at",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Updated At" />
			),
			cell: ({ row }) => {
				return (
					<div className="font-medium">
						{format(row.original.updated_at, "dd MMMM yyyy, HH:mm")}
					</div>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<WorkOrderTableActions row={row} workOrderId={row.original.id} />
			),
		},
	];
	return workOrderTableColumns;
}
