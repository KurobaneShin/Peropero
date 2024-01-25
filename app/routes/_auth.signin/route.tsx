import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/node"
import { Link, useActionData, useLoaderData } from "@remix-run/react"
import { z } from "zod"
import { supabase } from "~/infra/supabase"
import { accessToken } from "~/cookies"
import { makeForm } from "~/lib/makeForm"
import { useRef, useState } from "react"

import Hcaptcha from "@hcaptcha/react-hcaptcha"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { FormControl } from "~/components/custom/FormControl"
import { Input } from "~/components/ui/input"

const { parse } = makeForm(
	z.object({
		email: z.string().email(),
		password: z.string().min(6),
		captchaToken: z.string(),
	}),
)

export const action = async (agrs: ActionFunctionArgs) => {
	const session = await accessToken.getSession(
		agrs.request.headers.get("cookie"),
	)

	const { data, errors } = parse(await agrs.request.formData())

	if (errors) {
		return { errors }
	}

	const { email, password } = data

	const { data: user, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password,
		options: { captchaToken: data.captchaToken },
	})

	if (error || !user.user || !user) {
		return {
			errors: {
				captchaToken: "Invalid captcha",
			},
		}
	}

	const headers = new Headers()

	session.set("accessToken", user.session?.access_token)
	headers.append("Set-Cookie", await accessToken.commitSession(session))

	return redirect("/", {
		headers: {
			"Set-Cookie": await accessToken.commitSession(session),
		},
	})
}

export default function SignIn() {
	const actionData = useActionData<typeof action>()
	const [captchaToken, setCaptchaToken] = useState("")
	const captchaRef = useRef<any>()

	if (actionData?.errors) {
		captchaRef.current?.execute()
	}
	return (
		<form method="post">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">Sign in to your account</CardTitle>
					<CardDescription>
						Enter your email below to sign in to your account
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					<div className="grid gap-2">
						<FormControl
							label="E-mail"
							name="email"
							errors={actionData?.errors}>
							<Input id="email" type="email" placeholder="m@example.com" />
						</FormControl>
					</div>
					<div className="grid gap-2">
						<FormControl
							label="Password"
							name="password"
							errors={actionData?.errors}>
							<Input id="password" type="password" />
						</FormControl>
					</div>
					<FormControl name="captchaToken" errors={actionData?.errors}>
						<Hcaptcha
							ref={captchaRef}
							sitekey={"21327b3d-ef5c-4bb1-abfd-4227f319f9e3"}
							onVerify={(token) => setCaptchaToken(token)}
						/>
					</FormControl>
					<input type="hidden" name="captchaToken" value={captchaToken} />
				</CardContent>
				<CardFooter>
					<div className="w-full">
						<Button type="submit" className="w-full">
							Sign in
						</Button>
						<div className="mt-2">
							Don't have an account? <Link to="/signup">Sign up</Link>
						</div>
					</div>
				</CardFooter>
			</Card>
		</form>
	)
}
