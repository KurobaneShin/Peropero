import { supabase } from "~/infra/supabase"

export async function getAuthorById(authorId: string) {
	const { data, error } = await supabase
		.from("authors")
		.select("*")
		.eq("id", authorId)
		.maybeSingle()

	if (error || !data) {
		throw error || new Error("Author not found")
	}

	return data
}
