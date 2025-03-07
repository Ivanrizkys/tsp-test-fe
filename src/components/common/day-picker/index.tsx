import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { SelectSingleEventHandler } from "react-day-picker";

interface DayPickerProps {
	date?: Date;
	setDate?: SelectSingleEventHandler;
	buttonClassName?: ClassValue;
	placeholder?: string;
}

export function DayPicker({
	date,
	setDate,
	buttonClassName,
	placeholder,
}: DayPickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!date && "text-muted-foreground",
						buttonClassName,
					)}
				>
					<CalendarIcon />
					{date ? (
						format(date, "PPP")
					) : placeholder ? (
						placeholder
					) : (
						<span>Pick a date</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
