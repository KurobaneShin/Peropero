import { LoaderFunctionArgs } from "@remix-run/node"
import { redirect } from "react-router"
import { accessToken } from "~/cookies"
import { supabase } from "~/infra/supabase"

export const loader = async (args: LoaderFunctionArgs) => {
	const url = new URL(args.request.url)

	const tokenHash = url.searchParams.get("token_hash")
	const type = url.searchParams.get("type")

	if (!(tokenHash && type)) {
		return {}
	}

	const session = await accessToken.getSession(
		args.request.headers.get("Cookie"),
	)

	const { error, data } = await supabase.auth.verifyOtp({
		type: type as "email",
		// biome-ignore lint/style/useNamingConvention: third-party API
		token_hash: tokenHash as string,
	})

	if (error || !data || !data.user) {
		console.error(error)
		return { errors: { email: error?.message } }
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", data.user.id)
		.single()

	const headers = new Headers()

	session.set("accessToken", data.session?.access_token)
	session.set("profile", profile)

	headers.append("Set-Cookie", await accessToken.commitSession(session))

	return redirect("/", {
		headers: {
			"Set-Cookie": await accessToken.commitSession(session),
		},
	})
}

export default function Confirm() {
	return <div>Confirm your email</div>
}
