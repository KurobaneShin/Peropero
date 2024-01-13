import { Input } from "../ui/input"
import type { HTMLInputTypeAttribute } from "react"
import { Label } from "../ui/label"
import { useFormErrors } from "~/hooks/useFormErros"

type InputWithLabelProps = {
	name: string
	type?: HTMLInputTypeAttribute
	placeholder?: string
	label: string
	errors?: { [key: string]: string }
} & React.ComponentProps<typeof Input>

export const InputWithLabel = (props: InputWithLabelProps) => {
	const { name, type, placeholder, label, errors, ...rest } = props
	const message = useFormErrors({
		name,
		errors,
	})
	return (
		<div className="grid w-full items-center gap-1.5">
			<Label htmlFor={name}>{label}</Label>
			<Input
				{...rest}
				name={name}
				type={type}
				id={name}
				placeholder={placeholder}
			/>
			{message && <div className="text-red-500 text-xs">{message}</div>}
		</div>
	)
}
