import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { cn } from "~/lib/utils"
import { Button } from "../ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "../ui/command"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type Props = {
	items: { value: string; label: string }[]
	name: string
	label: string
}

export function ComboboxDemo({ items, name, label }: Props) {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState("")

	return (
		<>
			<Label htmlFor={name}>{label}</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild={true}>
					<Button
						id={name}
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[200px] justify-between">
						{value
							? items.find((item) => item.value === value)?.label
							: "Selecione um item..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder="Busque um item..." />
						<CommandEmpty>No item found.</CommandEmpty>
						<CommandGroup>
							{items.map((item) => (
								<CommandItem
									key={item.value}
									value={item.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue)
										setOpen(false)
									}}>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === item.value ? "opacity-100" : "opacity-0",
										)}
									/>
									{item.label}
								</CommandItem>
							))}
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>
			<input type="hidden" id={name} name={name} value={value} />
		</>
	)
}
