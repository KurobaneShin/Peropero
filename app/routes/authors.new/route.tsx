import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { ClientActionFunctionArgs, Form } from "@remix-run/react"
import { z } from "zod"
import { FormControl } from "~/components/custom/FormControl"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { supabase } from "~/infra/supabase"
import { getUser } from "~/lib/getUser"
import { makeForm } from "~/lib/makeForm"

const { parse } = makeForm(
	z.object({
		name: z.string().min(1),
	}),
)

export const loader = async ({ request }: ActionFunctionArgs) => {
	await getUser(request)
	return {}
}

export const action = async (args: ActionFunctionArgs) => {
	const formData = await args.request.formData()
	const { data, errors } = parse(formData)

	if (errors) {
		return { errors }
	}

	const { name } = data

	await supabase.from("authors").insert({
		name,
	})
	return redirect("/new")
}

export const clientAction = async ({
	serverAction,
}: ClientActionFunctionArgs) => {
	sessionStorage.removeItem("/new")
	const data = await serverAction()
	return data
}

export default function New() {
	return (
		<Form method="post">
			<FormControl name="name" label="Nome">
				<Input name="name" autoFocus={true} />
			</FormControl>
			<Button type="submit">Enviar</Button>
		</Form>
	)
}
