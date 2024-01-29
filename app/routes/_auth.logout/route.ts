import { LoaderFunctionArgs, redirect } from "@remix-run/node"
import { accessToken } from "~/cookies"

export const loader = async (args: LoaderFunctionArgs) => {
	const session = await accessToken.getSession(
		args.request.headers.get("Cookie"),
	)

	if (!session.has("accessToken")) {
		return redirect("/signin")
	}

	return redirect("/", {
		headers: {
			"Set-Cookie": await accessToken.destroySession(session),
		},
	})
}
