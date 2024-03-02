import {
	ClientActionFunctionArgs,
	Form,
	useActionData,
	useNavigate,
	useNavigation,
} from "@remix-run/react"
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@vercel/remix"
import { useEffect, useState } from "react"
import { z } from "zod"
import { FormControl } from "~/components/custom/FormControl"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
} from "~/components/ui/sheet"

import { defaultClientAction } from "~/lib/defaultClientCache"
import { getUser } from "~/lib/getUser"
import { makeForm } from "~/lib/makeForm"
import { createTag } from "~/repositories/supabase"

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

	await createTag(title)

	return redirect("/new")
}

export const clientAction = async (args: ClientActionFunctionArgs) =>
	defaultClientAction(args)

export default function New() {
	const transition = useNavigation()
	const navigate = useNavigate()
	const actionData = useActionData<typeof action>()
	const isSubmitting = transition.state === "submitting"

	const [isOpen, setIsOpen] = useState(false)

	const handleClose = () => navigate("/tags")

	const openSheet = () => setIsOpen(true)

	useEffect(openSheet, [])

	return (
		<Sheet open={isOpen}>
			<SheetContent
				onPointerDownOutside={handleClose}
				onCloseClick={handleClose}>
				<SheetHeader>
					<SheetHeader>Create a new tag</SheetHeader>
				</SheetHeader>
				<Form method="post" className="grid gap-4 py-4">
					<FormControl name="title" errors={actionData?.errors}>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="title" className="text-right">
								Title
							</Label>
							<Input
								id="title"
								name="title"
								autoFocus={true}
								className="col-span-3"
							/>
						</div>
					</FormControl>
					<SheetFooter>
						<SheetClose asChild={true}>
							<Button disabled={isSubmitting} type="submit">
								Create
							</Button>
						</SheetClose>
					</SheetFooter>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
