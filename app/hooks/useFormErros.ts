export const useFormErrors = ({
	errors,
	name,
}: {
	errors?: Record<string, string>
	name: string
}) => {
	if (!(name && errors && errors[name])) {
		return undefined
	}

	return errors[name]
}
