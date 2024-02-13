import { describe, expect, test } from "bun:test"
import { isDeferredData } from "@remix-run/server-runtime/dist/responses"
import jwt from "jsonwebtoken"
import { accessToken } from "~/cookies"
import { loader } from "./route"

describe("new", () => {
	test("if route is authenticated", async () => {
		const request = new Request("localhost:3000/new")
		try {
			await loader({ request, context: {}, params: {} })
		} catch (e) {
			expect(e).toBeInstanceOf(Response)
			const location = (e as Response).headers.get("location")
			expect(location).toEqual("/signin")
		}
	})
	test("response", async () => {
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

		const isDefer = isDeferredData(response)

		expect(isDefer).toBe(true)

		const author = await response.data.authors
		const groups = await response.data.groups
		const tags = await response.data.tags

		expect(author).toBeInstanceOf(Array)
		expect(groups).toBeInstanceOf(Array)
		expect(tags).toBeInstanceOf(Array)

		if (author[0]) {
			expect(author[0]).toHaveProperty("value")
			expect(author[0]).toHaveProperty("label")
		}

		if (groups[0]) {
			expect(groups[0]).toHaveProperty("value")
			expect(groups[0]).toHaveProperty("label")
		}

		if (tags[0]) {
			expect(tags[0]).toHaveProperty("value")
			expect(tags[0]).toHaveProperty("label")
		}
	})
})
