import { redirect } from "@remix-run/node"
import { jwtDecode } from "jwt-decode"
import { accessToken } from "~/cookies"

export const getUser = async (req: Request): Promise<string> => {
	const session = await accessToken.getSession(req.headers.get("Cookie"))

	if (!session.has("accessToken")) {
		throw redirect("/signin")
	}

	const jwt = session.get("accessToken")

	const { sub: userId, exp } = jwtDecode<{ sub: string; exp: number }>(jwt)

	if (exp * 1000 < Date.now()) {
		throw redirect("/signin")
	}

	return userId
}
