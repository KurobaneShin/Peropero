import { Outlet } from "@remix-run/react"
import { LoaderFunctionArgs, redirect } from "@vercel/remix"
import { accessToken } from "~/cookies"

export const loader = async (args: LoaderFunctionArgs) => {
	const session = await accessToken.getSession(
		args.request.headers.get("cookie"),
	)

	if (session.has("accessToken")) return redirect("/")

	return {}
}

export default function AuthLayout() {
	return <Outlet />
}
