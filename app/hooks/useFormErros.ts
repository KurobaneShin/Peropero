export const useFormErrors = ({
	errors,
	name,
}: {
	errors: any
	name: string
}) => {
	if (!name) return undefined
	if (!errors) return undefined
	if (!errors[name]) return undefined
	return errors[name]
}
