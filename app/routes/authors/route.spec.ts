import { expect, test } from "bun:test"
import { supabase } from "~/infra/supabase"
import { loader } from "./route"

test("random", async () => {
	const request = new Request("localhost:3000/authors")

	const response = await loader({ request, context: {}, params: {} })
	const { data, error } = await supabase
		.from("authors")
		.select("*,mangas_authors(mangas(id))")

	if (error) {
		return
	}

	expect(response.authors).toBeDefined()
	expect(response.authors).toEqual(data)
})
