import { describe, expect, test } from "bun:test"
import jwt from "jsonwebtoken"
import { accessToken } from "~/cookies"
import { loader } from "./route"

describe("auth", () => {
	test("ensure if user is authenticared redirect to /", async () => {
		const headers = new Headers()

		const session = await accessToken.getSession()

		const token = jwt.sign(
			{
				id: "1",
			},
			process.env.JWT_SECRET as string,
		)

		session.set("accessToken", token)
		headers.append("cookie", await accessToken.commitSession(session))

		const request = new Request("localhost:3000/new", {
			headers,
		})

		const response = await loader({ request, context: {}, params: {} })

		expect(response).toBeInstanceOf(Response)
		const location = (response as Response).headers.get("location")
		expect(location).toEqual("/")
	})
})
