import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ClassValue } from "clsx";

export interface ComboboxItem {
	value: string;
	label: string;
}

export interface ComboboxProps {
	items: ComboboxItem[];
	value: string;
	setValue: (value: string) => void;
	placeholder?: string;
	buttonClassName?: ClassValue;
	popoverClassName?: ClassValue;
}

export function Combobox({
	items,
	value,
	setValue,
	placeholder,
	buttonClassName,
	popoverClassName,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	// const [value, setValue] = React.useState("")

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="combobox"
					aria-expanded={open}
					className={cn("w-[200px] justify-between", buttonClassName)}
				>
					{value
						? items.find((item) => `${item.label}-${item.value}` === value)
								?.label
						: placeholder
							? placeholder
							: "Select item..."}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("w-[200px] p-0", popoverClassName)}>
				<Command>
					<CommandInput placeholder={placeholder ?? "Search item..."} />
					<CommandList>
						<CommandEmpty>No framework found.</CommandEmpty>
						<CommandGroup>
							{items.map((item) => (
								<CommandItem
									key={item.value}
									value={`${item.label}-${item.value}`}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue);
										setOpen(false);
									}}
								>
									{item.label}
									<Check
										className={cn(
											"ml-auto",
											value === `${item.label}-${item.value}`
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
