import { useActionData } from "@remix-run/react"
import { useState } from "react"
import { z } from "zod"
import { zfd } from "zod-form-data"

export function makeForm<T extends z.ZodTypeAny>(schema: T) {
	const parserFn = (f: FormData) => zfd.formData(schema).safeParse(f)
	return {
		parse: (f: FormData) => {
			const parsed = parserFn(f)

			if (!parsed.success) {
				const issuesAsErrors = parsed.error.issues.reduce(
					(errors, issue) => {
						errors[issue.path.join(".") as keyof z.infer<T>] = issue.message
						return errors
					},
					{} as { [K in keyof z.infer<T>]: string },
				)
				return { errors: issuesAsErrors, data: undefined }
			}
			return { data: parsed.data, errors: undefined }
		},
		useFormHandlers: () => {
			const actionData = useActionData() as {
				errors?: { [K in keyof z.infer<T>]: string }
			}
			const [errors, setErrors] = useState(actionData?.errors)
			const statefulParser = (formData: FormData) => {
				const parsed = parserFn(formData)
				if (!parsed.success) {
					const issuesAsErrors = parsed.error.issues.reduce(
						(errors, issue) => {
							errors[issue.path.join(".") as keyof z.infer<T>] = issue.message
							return errors
						},
						{} as { [K in keyof z.infer<T>]: string },
					)
					setErrors(issuesAsErrors)

					return { success: false as const, errors: issuesAsErrors }
				}

				return parsed
			}

			if (errors) {
				return {
					success: false as const,
					errors,
					parse: statefulParser,
				}
			}

			return { success: true as const, parse: statefulParser }
		},
	}
}
