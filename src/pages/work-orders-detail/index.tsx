import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WorkOrderStatus } from "@/enums/work-order";
import { useGetWorkOrdersDetail } from "@/service/work-order";
import { format } from "date-fns";
import {
	Calendar,
	CheckCircle,
	CheckSquare,
	CircleHelp,
	CircleSlash,
	Clock,
	FileText,
	Package,
	Target,
	User,
} from "lucide-react";
import { useParams } from "react-router";
import WorkOrderDetailSkeleton from "./skeleton";

// Helper function to format seconds to hours, minutes, seconds
const formatExecutionTime = (seconds: number | null) => {
	if (seconds === null) return "N/A";

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

export default function WorkOrderDetail() {
	// const { data } = orderDetail;
	const { workOrderId } = useParams();
	const { data: workOrder, isPending: isPendingWorkOrder } =
		useGetWorkOrdersDetail(Number(workOrderId), !!workOrderId);

	// Determine status color
	const getStatusColor = (statusName: string) => {
		switch (statusName.toLowerCase()) {
			case "completed":
				return "bg-emerald-500 text-white";
			case "in progress":
				return "bg-blue-500 text-white";
			case "pending":
				return "bg-amber-500 text-white";
			default:
				return "bg-slate-500 text-white";
		}
	};

	if (isPendingWorkOrder) return <WorkOrderDetailSkeleton />;

	return (
		<div className="min-h-screen">
			<div className="mx-auto p-4 md:p-8">
				{/* Header */}
				<div className="mb-6 border-b pb-2">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground mb-1">
								Work Order
							</p>
							<h1 className="text-xl font-bold tracking-tight">
								{workOrder?.data?.order_number}
							</h1>
						</div>
						<Badge
							className={`${getStatusColor(workOrder?.data?.current_status.name ?? "")} px-3 py-1.5 text-sm font-medium rounded-md`}
						>
							{workOrder?.data?.current_status?.name}
						</Badge>
					</div>
				</div>

				{/* Overview Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
					<Card className="border shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Product
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2">
								<Package className="h-5 w-5 text-muted-foreground" />
								<span className="text-lg font-semibold">
									{workOrder?.data?.product_name}
								</span>
							</div>
						</CardContent>
					</Card>

					<Card className="border shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Operator
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2">
								<User className="h-5 w-5 text-muted-foreground" />
								<span className="text-lg font-semibold">
									{workOrder?.data?.operator?.name}
								</span>
							</div>
						</CardContent>
					</Card>

					<Card className="border shadow-sm">
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium text-muted-foreground">
								Completion
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2">
								<Target className="h-5 w-5 text-muted-foreground" />
								<span className="text-lg font-semibold">
									{workOrder?.data?.actual_quantity ?? "-"}/
									{workOrder?.data?.expected_quantity} units
								</span>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Details Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
					<div>
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<FileText className="h-5 w-5" />
							Order Information
						</h2>
						<Card className="border shadow-sm">
							<CardContent>
								<dl className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Created
										</dt>
										<dd className="text-sm">
											{format(
												workOrder?.data?.created_at as Date,
												"dd MMMM yyyy, HH:mm",
											)}
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Due Date
										</dt>
										<dd className="text-sm">
											{format(
												workOrder?.data?.due_date as Date,
												"dd MMMM yyyy, HH:mm",
											)}
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Completed
										</dt>
										<dd className="text-sm">
											{workOrder?.data.actual_completion_date
												? format(
														workOrder?.data.actual_completion_date,
														"dd MMMM yyyy, HH:mm",
													)
												: "-"}
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Last Updated
										</dt>
										<dd className="text-sm">
											{format(
												workOrder?.data?.updated_at as Date,
												"dd MMMM yyyy, HH:mm",
											)}
										</dd>
									</div>
								</dl>
							</CardContent>
						</Card>
					</div>

					<div>
						<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<CheckSquare className="h-5 w-5" />
							Production Metrics
						</h2>
						<Card className="border shadow-sm">
							<CardContent>
								<dl className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Expected Quantity
										</dt>
										<dd className="text-sm">
											{workOrder?.data?.expected_quantity} units
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Actual Quantity
										</dt>
										<dd className="text-sm">
											{workOrder?.data?.actual_quantity ?? "-"} units
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Completion Rate
										</dt>
										<dd className="text-sm">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
												{workOrder?.data.actual_quantity
													? Math.round(
															(workOrder?.data.actual_quantity /
																workOrder?.data?.expected_quantity) *
																100,
														)
													: "0"}
												%
											</span>
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Status
										</dt>
										<dd className="text-sm">
											<Badge
												className={`${getStatusColor(workOrder?.data?.current_status?.name as string)} px-2 py-0.5 text-xs`}
											>
												{workOrder?.data.current_status.name}
											</Badge>
										</dd>
									</div>
								</dl>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* History Timeline */}
				<div className="mb-6">
					<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
						<Clock className="h-5 w-5" />
						Status History
					</h2>
					<Card className="border shadow-sm">
						<CardContent>
							{workOrder?.data.status_history.length === 0 ? (
								<p className="text-muted-foreground text-center py-8">
									No status history available
								</p>
							) : (
								<div className="space-y-8">
									{workOrder?.data.status_history.map((history, index) => (
										<div key={history.uuid} className="relative">
											{index !== workOrder?.data.status_history.length - 1 && (
												<div className="absolute top-7 left-3.5 bottom-0 w-px bg-border" />
											)}
											<div className="flex gap-6">
												<div className="flex-shrink-0 mt-1">
													<div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
														{history?.status_id === WorkOrderStatus.PENDING ? (
															<CircleHelp className="h-4 w-4 text-primary-foreground" />
														) : history?.status_id ===
															WorkOrderStatus.IN_PROGRESS ? (
															<Clock className="h-4 w-4 text-primary-foreground" />
														) : history?.status_id ===
															WorkOrderStatus.COMPLETED ? (
															<CheckCircle className="h-4 w-4 text-primary-foreground" />
														) : (
															<CircleSlash className="h-4 w-4 text-primary-foreground" />
														)}
													</div>
												</div>
												<div className="flex-1">
													<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
														<div>
															<p className="font-semibold text-base">
																{history.created_by.name}
															</p>
															<p className="text-sm text-muted-foreground">
																Produced: {history?.quantity_produced ?? 0}{" "}
																units
															</p>
														</div>
														<div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
															<Calendar className="h-4 w-4" />
															{format(
																history.created_at,
																"dd MMMM yyyy, HH:mm",
															)}
														</div>
													</div>

													{history.execute_time_seconds !== null && (
														<div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
															<Clock className="h-4 w-4" />
															<span>
																Execution time:{" "}
																{formatExecutionTime(
																	history.execute_time_seconds,
																)}
															</span>
														</div>
													)}

													{history.note && (
														<div className="mt-2 bg-muted p-4 rounded-lg text-sm">
															{history.note}
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* In Progress History */}
				<div>
					<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
						<Clock className="h-5 w-5" />
						In Progress History
					</h2>
					<Card className="border shadow-sm">
						<CardContent>
							{workOrder?.data?.in_progress_history?.length === 0 ? (
								<div className="text-center py-12">
									<p className="text-muted-foreground">
										No in-progress history available
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{workOrder?.data?.in_progress_history.map(
										(history, index) => (
											<div key={history.uuid} className="relative">
												{index !==
													workOrder?.data?.in_progress_history?.length - 1 && (
													<div className="absolute top-7 left-3.5 bottom-0 w-px bg-border" />
												)}
												<div className="flex gap-6">
													<div className="flex-shrink-0 mt-1">
														<div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center">
															<Clock className="h-4 w-4 text-white" />
														</div>
													</div>
													<div className="flex-1">
														<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
															<div>
																<p className="font-semibold text-base">
																	{history.name}
																</p>
																<p className="text-sm text-muted-foreground">
																	User ID: {history.created_by}
																</p>
															</div>
															<div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
																<Calendar className="h-4 w-4" />
																{format(
																	history.created_at,
																	"dd MMMM yyyy, HH:mm",
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										),
									)}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
