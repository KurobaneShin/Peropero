import { describe, expect, test } from "bun:test"

import { getUser } from "./getUser"
import { accessToken } from "~/cookies"

describe("getUser", () => {
	test("should redirect if no accessToken", async () => {
		const headers = new Headers()

		const req = {
			headers,
		} as Request

		const res = await getUser(req)

		expect(res).toBeInstanceOf(Response)
		expect((res as unknown as Response).status).toBe(302)
		expect((res as unknown as Response).headers.get("Location")).toBe("/signin")
	})

	test("should redirect if accessToken expired", async () => {
		const headers = new Headers()

		const req1 = {
			headers,
		} as Request

		const session = await accessToken.getSession(req1.headers.get("cookie"))

		session.set(
			"accessToken",
			"ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjI5",
		)

		headers.append("Set-Cookie", await accessToken.commitSession(session))

		const req = {
			headers,
		} as Request

		const res = await getUser(req)
		expect(res).toBeInstanceOf(Response)
		expect((res as unknown as Response).status).toBe(302)
		expect((res as unknown as Response).headers.get("Location")).toBe("/signin")
	})
})
