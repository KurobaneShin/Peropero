import { describe, expect, test } from "bun:test"
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
})
