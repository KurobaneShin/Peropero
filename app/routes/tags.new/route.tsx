import { ActionFunctionArgs, redirect } from "@remix-run/node"
import {
	ClientActionFunctionArgs,
	Form,
	useActionData,
	useLoaderData,
} from "@remix-run/react"
import { z } from "zod"
import { InputWithLabel } from "~/components/custom/inputWithLabel"
import { Button } from "~/components/ui/button"
import { supabase } from "~/infra/supabase"
import { makeForm } from "~/lib/makeForm"

const { parse } = makeForm(
	z.object({
		title: z.string().min(1),
	}),
)

export const action = async (args: ActionFunctionArgs) => {
	const formData = await args.request.formData()
	const { data, errors } = parse(formData)

	if (errors) return { errors }

	const { title } = data

	await supabase.from("tags").insert({
		title,
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
	const data = useActionData<typeof action>()
	console.log(data)

	return (
		<Form method="post">
			<InputWithLabel autoFocus label="Title" name="title" />
			<Button type="submit">Enviar</Button>
		</Form>
	)
}
