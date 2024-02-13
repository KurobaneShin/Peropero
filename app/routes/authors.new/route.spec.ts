import { describe, expect, mock, test } from "bun:test"
import { deleteAuthor, selectLastInsertedAuthor } from "~/repositories/supabase"
import { action, loader } from "./route"

describe("authors.new", () => {
	test("if route is authenticated", async () => {
		const request = new Request("localhost:3000/authors/new")
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
		const request = new Request("localhost:3000/authors/new")
		try {
			await loader({ request, context: {}, params: {} })
			expect(getUser).toHaveBeenCalled()
		} catch (e) {
			expect(e).toBeInstanceOf(Response)
		}
	})

	test("test if author is created correctly", async () => {
		const body = new URLSearchParams({
			name: "test",
		})
		const request = new Request("localhost:3000/authors/new", {
			method: "POST",
			body,
		})
		const response = await action({ request, context: {}, params: {} })
		expect(response).toBeInstanceOf(Response)
		const location = (response as Response).headers.get("location")

		const lastInserted = await selectLastInsertedAuthor()

		expect(lastInserted.name).toEqual("test")
		if (!lastInserted.id) throw new Error("No id found")
		await deleteAuthor(lastInserted.id)

		expect(location).toEqual("/new")
	})

	test("post is validated correctly", async () => {
		const body = new URLSearchParams({})
		const request = new Request("localhost:3000/authors/new", {
			method: "POST",
			body,
		})
		const response = await action({ request, context: {}, params: {} })
		expect(response).toHaveProperty("errors.name")
	})
})
