import TableLoader from "@/components/common/data-table-loader";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useGetWorkOrderOperatorReport } from "@/service/work-order";

export default function OperatorReport() {
	const { data: operatorReports, isPending: isPendingOperatorReports } =
		useGetWorkOrderOperatorReport();

	return (
		<main className="p-4 md:p-8">
			<section className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow data-state="selected">
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Pending</TableHead>
							<TableHead>In Progress</TableHead>
							<TableHead>Completed</TableHead>
							<TableHead>Canceled</TableHead>
							<TableHead>Total</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!isPendingOperatorReports ? (
							<>
								{operatorReports?.data.length ? (
									operatorReports.data.map((report) => (
										<TableRow key={report.uuid}>
											<TableCell>{report?.name}</TableCell>
											<TableCell>{report?.email}</TableCell>
											<TableCell>{report?.pending_count}</TableCell>
											<TableCell>{report?.in_progress_count}</TableCell>
											<TableCell>{report?.completed_count}</TableCell>
											<TableCell>{report?.canceled_count}</TableCell>
											<TableCell>{report?.total_count}</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={7} className="h-24 text-center">
											No results.
										</TableCell>
									</TableRow>
								)}
							</>
						) : (
							<TableLoader colSpan={7} />
						)}
					</TableBody>
				</Table>
			</section>
		</main>
	);
}
