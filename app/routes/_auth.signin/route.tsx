import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	redirect,
} from "@remix-run/node"
import { useActionData, useLoaderData } from "@remix-run/react"
import { z } from "zod"
import { supabase } from "~/infra/supabase"
import { accessToken } from "~/cookies"
import { makeForm } from "~/lib/makeForm"
import { useRef, useState } from "react"

import Hcaptcha from "@hcaptcha/react-hcaptcha"
const { parse } = makeForm(
	z.object({
		email: z.string().email(),
		password: z.string().min(6),
		captchaToken: z.string(),
	}),
)

export const action = async (agrs: ActionFunctionArgs) => {
	//presentation
	// const req = await agrs.request.text();

	// const data = qs.parse(req);

	// const result = adminFormSchema.safeParse(data);

	// if (!result.success) {
	//   return {
	//     errors: result.error.formErrors.fieldErrors,
	//   };
	// }

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
				email: ["Email ou senha inválidas"],
				password: ["Email ou senha inválidas"],
			},
		}
	}

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

export default function SignIn() {
	const actionData = useActionData<typeof action>()
	const [captchaToken, setCaptchaToken] = useState("")
	const captchaRef = useRef<any>()

	if (actionData?.errors) {
		captchaRef.current?.execute()
	}
	return (
		<div>
			---------------------
			<form method="post">
				------------
				<div>
					<label htmlFor="email">Email</label>
					<input type="text" name="email" />
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input type="password" name="password" />
				</div>
				<Hcaptcha
					ref={captchaRef}
					sitekey={"21327b3d-ef5c-4bb1-abfd-4227f319f9e3"}
					onVerify={(token) => setCaptchaToken(token)}
				/>
				<input type="hidden" name="captchaToken" value={captchaToken} />
				<button type="submit">Enviar</button>
			</form>
		</div>
	)
}
