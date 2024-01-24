import { type ActionFunctionArgs, redirect } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { z } from "zod"
import { InputWithLabel } from "~/components/custom/inputWithLabel"
import { Button } from "~/components/ui/button"
import { zfd } from "zod-form-data"
import { accessToken } from "~/cookies"
import { supabase } from "~/infra/supabase"
import { makeForm } from "~/lib/makeForm"
import { useRef, useState } from "react"
import Hcaptcha from "@hcaptcha/react-hcaptcha"

const adminFormSchema = zfd.formData({
	name: zfd.text(z.string().min(3)),
	email: zfd.text(z.string().email()),
	password: zfd.text(z.string().min(6)),
	captchaToken: zfd.text(z.string()),
})

const { parse } = makeForm(
	z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
		captchaToken: z.string(),
	}),
)

export const action = async (agrs: ActionFunctionArgs) => {
	const req = await agrs.request.formData()

	const { data, errors } = parse(req)
	if (errors) {
		return { errors }
	}

	const { data: user, error } = await supabase.auth.signUp({
		email: data.email,
		password: data.password,
		options: { captchaToken: data.captchaToken },
	})

	if (error || !user.user) {
		return { errors: { email: error?.message ?? "error" } }
	}

	await supabase.from("profiles").insert({
		username: data.name,
		email: data.email,
		id: user.user.id,
	})

	const headers = new Headers()
	const session = await accessToken.getSession(
		agrs.request.headers.get("cookie"),
	)
	session.set("accessToken", user.session?.access_token)
	headers.append("Set-Cookie", await accessToken.commitSession(session))

	return redirect("/", {
		headers: {
			"Set-Cookie": await accessToken.commitSession(session),
		},
	})
}

export default function Signup() {
	const actionData = useActionData<typeof action>()
	const [captchaToken, setCaptchaToken] = useState("")
	const captchaRef = useRef<any>()

	if (actionData?.errors) {
		captchaRef.current?.execute()
	}

	return (
		<div className="bg-background  h-screen">
			<Form method="post" className="flex flex-col gap-4">
				<InputWithLabel name="name" label="Nome" errors={actionData?.errors} />
				<InputWithLabel
					name="email"
					label="Email"
					errors={actionData?.errors}
				/>
				<InputWithLabel
					name="password"
					label="Password"
					type="password"
					errors={actionData?.errors}
				/>
				<Hcaptcha
					ref={captchaRef}
					sitekey={"21327b3d-ef5c-4bb1-abfd-4227f319f9e3"}
					onVerify={(token) => setCaptchaToken(token)}
				/>
				<input type="hidden" name="captchaToken" value={captchaToken} />

				<Button type="submit">Submit</Button>
			</Form>
		</div>
	)
}
