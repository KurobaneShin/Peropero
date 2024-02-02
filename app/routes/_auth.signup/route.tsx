import { type ActionFunctionArgs, redirect } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import { z } from "zod"
import { InputWithLabel } from "~/components/custom/inputWithLabel"
import { Button } from "~/components/ui/button"
import { accessToken } from "~/cookies"
import { supabase } from "~/infra/supabase"
import { makeForm } from "~/lib/makeForm"
import { useRef, useState } from "react"
import Hcaptcha from "@hcaptcha/react-hcaptcha"
import { Card, CardContent } from "~/components/ui/card"

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
		console.error(error)
		//todo 'captcha verification process failed' handle captcha error
		return { errors: { email: error?.message ?? "error" } }
	}

	await supabase.from("profiles").insert({
		username: data.name,
		email: data.email,
		id: user.user.id,
	})

	if (process.env.NODE_ENV === "production") {
		return redirect("/confirm-email")
	}

	const headers = new Headers()
	const session = await accessToken.getSession(
		agrs.request.headers.get("cookie"),
	)
	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.user.id)
		.single()

	session.set("accessToken", user.session?.access_token)

	session.set("profile", profile)
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
		<Form method="post" className="px-4 mx-auto py-6">
			<Card>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<InputWithLabel
							name="name"
							label="Nome"
							errors={actionData?.errors}
						/>
					</div>
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
				</CardContent>
			</Card>
		</Form>
	)
}
