import { describe, expect, test } from "bun:test"
import { supabase } from "~/infra/supabase"
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

	test("post is validated correctly", async () => {
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

		const lastInserted = await supabase
			.from("authors")
			.select("*")
			.order("id", { ascending: false })
			.limit(1)
			.maybeSingle()

		expect(lastInserted.data?.name).toEqual("test")
		if (!lastInserted.data?.id) throw new Error("No id found")
		await supabase.from("authors").delete().eq("id", lastInserted.data?.id)

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
