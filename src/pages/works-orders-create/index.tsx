import { Combobox } from "@/components/common/combobox";
import { DayPicker } from "@/components/common/day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useGetOperators } from "@/service/user";
import { useCreateWorkOrderMutation } from "@/service/work-order";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

interface CreateWoFormValues {
	productName: string;
	expectedQuantitiy: number;
	operator: string;
	dueDate: Date;
	note: string;
}

export default function CreateWorkOrder() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CreateWoFormValues>();
	const { data: operators, isPending: isPendingOperators } = useGetOperators();
	const { mutate: doCreateWO, isPending: isPendingCreateWO } =
		useCreateWorkOrderMutation();

	const handleCreateWorkOrder: SubmitHandler<CreateWoFormValues> = async (
		data,
	) => {
		doCreateWO(
			{
				due_date: data.dueDate,
				expected_quantity: Number(data.expectedQuantitiy),
				operator_id: Number(data.operator.split("-")[1]),
				product_name: data.productName,
				...(data.note ? { note: data.note } : {}),
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["work-orders"] });
					toast("Work Order Created", {
						description: "Your work order has been successfully created.",
					});
					navigate("/");
				},
				onError: (error) => {
					toast.error("Work Order Creation Failed", {
						description: ` ${error.message ?? "Unable to create a work order"}. Please check your input and try again.`,
					});
					import.meta.env.DEV && console.error("Error occured", error);
				},
			},
		);
	};

	return (
		<main className="p-4 md:p-8">
			<form
				className="grid grid-cols-1 gap-5"
				onSubmit={handleSubmit(handleCreateWorkOrder)}
			>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div>
						<Label>Product Name</Label>
						<Input
							placeholder="Insert product name"
							className="mt-2"
							aria-invalid={errors.productName ? "true" : "false"}
							{...register("productName", {
								required: "Product name can't be empty!",
							})}
						/>
						{errors.productName && (
							<span role="alert" className="text-destructive text-sm -mt-1">
								{errors.productName?.message}
							</span>
						)}
					</div>
					<div>
						<Label>Expected Quantity</Label>
						<Input
							type="number"
							placeholder="Insert expected quantity"
							className="mt-2"
							aria-invalid={errors.expectedQuantitiy ? "true" : "false"}
							{...register("expectedQuantitiy", {
								required: "Expected quantity can't be empty!",
							})}
						/>
						{errors.expectedQuantitiy && (
							<span role="alert" className="text-destructive text-sm -mt-1">
								{errors.expectedQuantitiy?.message}
							</span>
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div>
						<Label>Operator</Label>
						{!operators || isPendingOperators ? (
							<Input className="mt-2" disabled />
						) : (
							<Controller
								control={control}
								rules={{ required: "Operator can/t be empty!" }}
								name="operator"
								render={({ field }) => (
									<Combobox
										items={operators.data.map((operator) => ({
											label: operator.name,
											value: String(operator.id),
										}))}
										value={field.value}
										setValue={(value) => field.onChange(value)}
										buttonClassName={cn(
											"mt-2 w-full",
											!!errors.operator &&
												"ring-destructive/20 dark:ring-destructive/40 border-destructive",
										)}
										popoverClassName="w-radix-popover-triger-width"
										placeholder="Select operator"
									/>
								)}
							/>
						)}
						{errors.operator && (
							<span role="alert" className="text-destructive text-sm -mt-1">
								{errors.operator?.message}
							</span>
						)}
					</div>
					<div>
						<Label>Due Date</Label>
						{/* <Input placeholder="Insert due date" className="mt-2" /> */}
						<Controller
							control={control}
							rules={{ required: "Due date can't be empty!" }}
							name="dueDate"
							render={({ field }) => (
								<DayPicker
									date={field.value}
									setDate={(date) => field.onChange(date)}
									buttonClassName={cn(
										"mt-2 w-full",
										!!errors.dueDate &&
											"ring-destructive/20 dark:ring-destructive/40 border-destructive",
									)}
								/>
							)}
						/>
						{errors.dueDate && (
							<span role="alert" className="text-destructive text-sm -mt-1">
								{errors.dueDate?.message}
							</span>
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 ">
					<Label>Note</Label>
					<Textarea
						placeholder="Insert note"
						className="mt-2"
						{...register("note")}
					/>
				</div>
				<div className="flex justify-end gap-2 mt-10">
					<Link to="/">
						<Button type="button" variant="destructive">
							Cancel
						</Button>
					</Link>
					<Button type="submit" disabled={isPendingCreateWO}>
						Insert
						{isPendingCreateWO && <Loader2 className="w-4 h-4 animate-spin" />}
					</Button>
				</div>
			</form>
		</main>
	);
}
