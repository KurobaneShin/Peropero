import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node"
import { ClientActionFunctionArgs, Form, useNavigation } from "@remix-run/react"
import { z } from "zod"
import { FormControl } from "~/components/custom/FormControl"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { supabase } from "~/infra/supabase"
import { getUser } from "~/lib/getUser"
import { makeForm } from "~/lib/makeForm"

const { parse } = makeForm(
	z.object({
		title: z.string().min(1),
	}),
)

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await getUser(request)
	return {}
}

export const action = async (args: ActionFunctionArgs) => {
	const formData = await args.request.formData()
	const { data, errors } = parse(formData)

	if (errors) {
		return { errors }
	}

	const { title } = data

	await supabase.from("groups").insert({
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
	const transition = useNavigation()
	const isSubmitting = transition.state === "submitting"
	return (
		<Form method="post">
			<FormControl name="title" label="Nome">
				<Input name="title" autoFocus={true} />
			</FormControl>
			<Button disabled={isSubmitting} type="submit">
				Create
			</Button>
		</Form>
	)
}
