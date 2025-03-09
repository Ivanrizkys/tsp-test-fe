import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { UserRole } from "@/enums/user";
import { WorkOrderStatus } from "@/enums/work-order";
import { useGetOperators } from "@/service/user";
import {
	useDeleteWorkOrderMutation,
	useGetWorkOrderStatus,
	useGetWorkOrdersDetail,
	useUpdateWorkOrderManagerMutation,
	useUpdateWorkOrderOperatorMutation,
} from "@/service/work-order";
import { useUserStore } from "@/store/user";
import { DialogClose } from "@radix-ui/react-dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type DefaultError, useQueryClient } from "@tanstack/react-query";
import type { Row } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";

interface EditWorkOrderFormValues {
	operator: string;
	status: string;
	quantityProduced: string;
	note?: string;
}

interface AddProgressFormValues {
	progressName: string;
}

interface WorkOrderTableActionsProps<TData> {
	row: Row<TData>;
	workOrderId: number;
}

export default function WorkOrderTableActions<TData>({
	workOrderId,
}: WorkOrderTableActionsProps<TData>) {
	const [sheetOpen, setSheetOpen] = useState(false);
	const [insertProgressDialog, setInsertProgressDialog] = useState(false);

	const user = useUserStore((state) => state.user);

	const queryClient = useQueryClient();
	const {
		register: registerEdit,
		control: controlEdit,
		watch: watchEdit,
		handleSubmit: handleSubmitEdit,
		formState: { errors: errorEdit },
	} = useForm<EditWorkOrderFormValues>();
	const {
		reset: resetProgress,
		register: registerProgress,
		handleSubmit: handleSubmitProgress,
		formState: { errors: errorProgrress },
	} = useForm<AddProgressFormValues>();
	const { mutate: doDelete, isPending: isPendingDelete } =
		useDeleteWorkOrderMutation();
	const { data: operators, isPending: isPendingOperators } = useGetOperators();
	const { data: workOrder, isPending: isPendingWorkOrder } =
		useGetWorkOrdersDetail(workOrderId);
	const { data: workOrderStatus, isPending: isPendingWorkOrderStatus } =
		useGetWorkOrderStatus();
	const { mutate: doUpdateWoOperator, isPending: isPendingUpdateWoOperator } =
		useUpdateWorkOrderOperatorMutation();
	const { mutate: doUpdateWoManager, isPending: isPendingUpdateWoManager } =
		useUpdateWorkOrderManagerMutation();

	const handleEditWorkOrder: SubmitHandler<EditWorkOrderFormValues> = (
		data,
	) => {
		const handleSuccess = () => {
			queryClient.invalidateQueries({ queryKey: ["work-orders"] });
			queryClient.invalidateQueries({
				queryKey: ["work-orders-detail", workOrderId],
			});
			toast("Work Order Updated", {
				description: "Your work order has been successfully updated.",
			});
			setSheetOpen(false);
		};
		const handleError = (error: DefaultError) => {
			toast.error("Work Order Update Failed", {
				description: ` ${error.message ?? "Unable to update a work order"}. Please check your input and try again.`,
			});
			import.meta.env.DEV && console.error("Error occured", error);
		};
		if (user?.role === UserRole.PRODUCTION_MANAGER) {
			doUpdateWoManager(
				{
					operator_id: Number(data.operator),
					quantity_produced: data.quantityProduced
						? Number(data.quantityProduced)
						: 0,
					status_id: Number(data.status),
					work_order_id: workOrder?.data.id as number,
					...(data.note ? { note: data.note } : {}),
				},
				{
					onSuccess: () => {
						handleSuccess();
					},
					onError: (error) => {
						handleError(error);
					},
				},
			);
		} else if (user?.role === UserRole.OPERATOR) {
			doUpdateWoOperator(
				{
					quantity_produced: data.quantityProduced
						? Number(data.quantityProduced)
						: 0,
					status_id: Number(data.status),
					work_order_id: workOrder?.data.id as number,
					...(data.note ? { note: data.note } : {}),
				},
				{
					onSuccess: () => {
						handleSuccess();
					},
					onError: (error) => {
						handleError(error);
					},
				},
			);
		}
	};

	const handleAddProgress: SubmitHandler<AddProgressFormValues> = (data) => {
		const addProgress =
			user?.role === UserRole.PRODUCTION_MANAGER
				? doUpdateWoManager
				: doUpdateWoOperator;
		addProgress(
			{
				operator_id: workOrder?.data.operator.id as number,
				status_id: workOrder?.data.current_status.id as number,
				work_order_id: workOrderId,
				in_progress_state: data.progressName,
				quantity_produced: 0,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["work-orders-detail", workOrderId],
					});
					queryClient.invalidateQueries({
						queryKey: ["work-order-operator-report"],
					});
					toast("Work Order Progress Added", {
						description:
							"Progress has been successfully added to the work order.",
					});
					resetProgress();
					setInsertProgressDialog(false);
				},
				onError: (error) => {
					toast.error("Failed to Add Work Order Progress", {
						description: ` ${error.message ?? "Unable to add progress a work order"}. Please check your input and try again.`,
					});
					import.meta.env.DEV && console.error("Error occured", error);
				},
			},
		);
	};

	const handleDeleteWo = () => {
		doDelete(
			{
				work_order_id: workOrderId,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["work-orders"] });
					toast("Work Orders Deleted", {
						description:
							"The selected work orders have been successfully deleted.",
					});
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
		<>
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
					<DropdownMenuItem onClick={() => setSheetOpen(true)}>
						Edit
					</DropdownMenuItem>
					{workOrder?.data.current_status.id ===
						WorkOrderStatus.IN_PROGRESS && (
						<DropdownMenuItem onClick={() => setInsertProgressDialog(true)}>
							Add Progress
						</DropdownMenuItem>
					)}
					<DropdownMenuItem>
						<Link to={`/work-orders/${workOrderId}`} className="w-full">
							View
						</Link>
					</DropdownMenuItem>
					{user?.role === UserRole.PRODUCTION_MANAGER && (
						<DropdownMenuItem onClick={handleDeleteWo}>
							Delete
							{isPendingDelete && <Loader2 className="w-4 h-4 animate-spin" />}
							<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Edit Work Order</SheetTitle>
						<SheetDescription>
							Make changes to selected work order. Click save when you're done.
						</SheetDescription>
					</SheetHeader>
					<form
						className="grid gap-4 p-4"
						onSubmit={handleSubmitEdit(handleEditWorkOrder)}
					>
						{user?.role === UserRole.PRODUCTION_MANAGER && (
							<div className="grid gap-2">
								<Label>Operator</Label>
								{!workOrder &&
								isPendingWorkOrder &&
								!operators &&
								isPendingOperators ? (
									<Input disabled />
								) : (
									<Controller
										defaultValue={String(workOrder?.data?.operator.id)}
										rules={{ required: "Operator can't be empty!" }}
										control={controlEdit}
										name="operator"
										render={({ field }) => (
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select operator">
														{field.value
															? operators?.data.find(
																	(item) => String(item.id) === field.value,
																)?.name
															: "Not found"}
													</SelectValue>
												</SelectTrigger>
												<SelectContent>
													{operators?.data.map((operator) => (
														<SelectItem
															key={operator.uuid}
															value={String(operator.id)}
														>
															{operator.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
								)}
							</div>
						)}
						<div className="grid gap-2">
							<Label>Status</Label>
							{!workOrder &&
							isPendingWorkOrder &&
							!workOrderStatus &&
							isPendingWorkOrderStatus ? (
								<Input disabled />
							) : (
								<Controller
									defaultValue={String(workOrder?.data?.current_status.id)}
									rules={{ required: "Status can't be empty!" }}
									control={controlEdit}
									name="status"
									render={({ field }) => (
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select status">
													{field.value
														? workOrderStatus?.data.find(
																(item) => String(item.id) === field.value,
															)?.name
														: "Not found"}
												</SelectValue>
											</SelectTrigger>
											<SelectContent>
												{workOrderStatus?.data.map((item) => (
													<SelectItem
														key={item.uuid}
														value={String(item.id)}
														disabled={
															item.id <
															(workOrder?.data.current_status.id as number)
														}
													>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
							)}
						</div>
						{workOrder &&
							Number(watchEdit("status")) >
								workOrder?.data.current_status.id && (
								<div className="grid gap-2">
									<Label htmlFor="quantity-produced">Quantity Produced</Label>
									<Input
										id="quantity-produced"
										type="number"
										placeholder="Insert quantity produced"
										aria-invalid={errorEdit.quantityProduced ? "true" : "false"}
										{...registerEdit("quantityProduced", {
											required: "Quantity produced can't be empty!",
										})}
									/>
									{errorEdit.quantityProduced && (
										<span
											role="alert"
											className="text-destructive text-sm -mt-1"
										>
											{errorEdit.quantityProduced?.message}
										</span>
									)}
								</div>
							)}
						<div className="grid gap-2">
							<Label htmlFor="note">Note</Label>
							<Textarea
								id="note"
								placeholder="Insert note"
								{...registerEdit("note")}
							/>
						</div>
					</form>
					<SheetFooter>
						<SheetClose asChild>
							<Button
								type="submit"
								disabled={isPendingUpdateWoManager || isPendingUpdateWoOperator}
								onClick={handleSubmitEdit(handleEditWorkOrder)}
							>
								Save changes
								{(isPendingUpdateWoManager || isPendingUpdateWoOperator) && (
									<Loader2 className="w-4 h-4 animate-spin" />
								)}
							</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>

			<Dialog
				open={insertProgressDialog}
				onOpenChange={(open) => {
					setInsertProgressDialog(open);
					if (!open) {
						resetProgress();
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Work Order Progress?</DialogTitle>
						<DialogDescription>
							Please enter the latest progress details for this work order.
							Ensure all relevant updates, including task completion percentage,
							remarks, and any issues encountered, are recorded accurately.
						</DialogDescription>
					</DialogHeader>
					<form
						onSubmit={handleSubmitProgress(handleAddProgress)}
						className="grid gap-2"
					>
						<Label htmlFor="progress-name">Progress Name</Label>
						<Textarea
							id="progress-name"
							aria-invalid={errorProgrress.progressName ? "true" : "false"}
							{...registerProgress("progressName", {
								required: "Progress name can't be empty!",
							})}
						/>
						{errorProgrress.progressName && (
							<span role="alert" className="text-destructive text-sm -mt-1">
								{errorProgrress.progressName?.message}
							</span>
						)}
					</form>
					<DialogFooter className="sm:justify-end">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Cancel
							</Button>
						</DialogClose>
						<Button
							onClick={handleSubmitProgress(handleAddProgress)}
							disabled={isPendingUpdateWoManager || isPendingUpdateWoOperator}
						>
							Save
							{(isPendingUpdateWoManager || isPendingUpdateWoOperator) && (
								<Loader2 className="w-4 h-4 animate-spin" />
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
