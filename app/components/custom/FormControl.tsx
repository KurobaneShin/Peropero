import { Label } from "@radix-ui/react-label"
import React from "react"

interface FormControlProps {
	name: string
	children: React.ReactNode | React.ReactNode[]
	label?: string
	errors?: { [k: string]: string }
	errorIcon?: React.ReactNode | React.ReactNode[]
	helperText?: string
	tag?: React.ReactNode
	className?: string
}

export const FormControl = ({
	children,
	errors,
	name,
	label,
	helperText,
	tag,
	className,
}: FormControlProps) => {
	const hasError = errors && name in errors

	return (
		<div aria-invalid={hasError} className={className}>
			<div className="flex w-full items-center justify-between">
				{label && <Label htmlFor={name}>{label}</Label>}
				{tag && tag}
			</div>
			{children}
			{hasError ? (
				<small
					className="text-sm font-medium leading-none text-red-500"
					data-cy={`error-${name}`}>
					{typeof errors[name] === "string" ? errors[name] : errors[name][0]}
				</small>
			) : helperText ? (
				<small className="text-sm font-medium leading-none">{helperText}</small>
			) : (
				<></>
			)}
		</div>
	)
}
