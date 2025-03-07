import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Calendar,
	CheckCircle,
	CheckSquare,
	Clock,
	FileText,
	Package,
	Target,
	User,
} from "lucide-react";

export default function WorkOrderDetailSkeleton() {
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
							<Skeleton className="h-7 w-48" />
						</div>
						<Skeleton className="h-8 w-24 rounded-md" />
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
								<Skeleton className="h-6 w-32" />
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
								<Skeleton className="h-6 w-32" />
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
								<Skeleton className="h-6 w-32" />
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
											<Skeleton className="h-4 w-full" />
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Due Date
										</dt>
										<dd className="text-sm">
											<Skeleton className="h-4 w-full" />
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Completed
										</dt>
										<dd className="text-sm">
											<Skeleton className="h-4 w-full" />
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Last Updated
										</dt>
										<dd className="text-sm">
											<Skeleton className="h-4 w-full" />
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
											<Skeleton className="h-4 w-20" />
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Actual Quantity
										</dt>
										<dd className="text-sm">
											<Skeleton className="h-4 w-20" />
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Completion Rate
										</dt>
										<dd className="text-sm">
											<Skeleton className="h-5 w-16 rounded-full" />
										</dd>
									</div>
									<Separator />
									<div className="grid grid-cols-2 gap-4">
										<dt className="text-sm font-medium text-muted-foreground">
											Status
										</dt>
										<dd className="text-sm">
											<Skeleton className="h-5 w-20 rounded-md" />
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
							<div className="space-y-8">
								{[1, 2].map((index) => (
									<div key={index} className="relative">
										{index !== 1 && (
											<div className="absolute top-7 left-3.5 bottom-0 w-px bg-border" />
										)}
										<div className="flex gap-6">
											<div className="flex-shrink-0 mt-1">
												<div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
													<CheckCircle className="h-4 w-4 text-primary/40" />
												</div>
											</div>
											<div className="flex-1">
												<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
													<div>
														<Skeleton className="h-5 w-32 mb-1" />
														<Skeleton className="h-4 w-24" />
													</div>
													<div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
														<Calendar className="h-4 w-4" />
														<Skeleton className="h-4 w-32" />
													</div>
												</div>

												<div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
													<Clock className="h-4 w-4" />
													<Skeleton className="h-4 w-28" />
												</div>

												<div className="mt-2 bg-muted p-4 rounded-lg">
													<Skeleton className="h-4 w-full mb-2" />
													<Skeleton className="h-4 w-3/4" />
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
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
							<div className="space-y-4">
								{[1, 2, 3].map((index) => (
									<div key={index} className="relative">
										{index !== 2 && (
											<div className="absolute top-7 left-3.5 bottom-0 w-px bg-border" />
										)}
										<div className="flex gap-6">
											<div className="flex-shrink-0 mt-1">
												<div className="h-7 w-7 rounded-full bg-blue-500/20 flex items-center justify-center">
													<Clock className="h-4 w-4 text-blue-500/40" />
												</div>
											</div>
											<div className="flex-1">
												<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
													<div>
														<Skeleton className="h-5 w-40 mb-1" />
														<Skeleton className="h-4 w-20" />
													</div>
													<div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
														<Calendar className="h-4 w-4" />
														<Skeleton className="h-4 w-32" />
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
