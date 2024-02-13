import { describe, expect, mock, test } from "bun:test"
import { loader } from "./route"

describe("characters.new", () => {
	test("if route is authenticated", async () => {
		const request = new Request("localhost:3000/characters/new")
		try {
			await loader({ request, context: {}, params: {} })
		} catch (e) {
			expect(e).toBeInstanceOf(Response)
			const location = (e as Response).headers.get("location")
			expect(location).toEqual("/signin")
		}
	})
	test("ensure get user is called", async () => {
		const getUser = mock(() => {})
		const request = new Request("localhost:3000/characters/new")
		try {
			await loader({ request, context: {}, params: {} })
			expect(getUser).toHaveBeenCalled()
		} catch (e) {
			expect(e).toBeInstanceOf(Response)
		}
	})
})
