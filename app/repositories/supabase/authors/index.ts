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

export async function createAuthor(name: string) {
	const { data, error } = await supabase
		.from("authors")
		.insert({
			name,
		})
		.select()
		.maybeSingle()

	if (error) {
		throw error
	}

	return data
}

export async function insertMangaAuthors({
	mangaId,
	authors,
}: {
	authors: string | string[]
	mangaId: string | number
}) {
	const authorsToInsert = Array.isArray(authors) ? authors : [authors]

	const mangaAuthor = authorsToInsert.map((authorId) => ({
		author: Number(authorId),
		manga: Number(mangaId),
	}))

	const { data, error } = await supabase
		.from("mangas_authors")
		.insert(mangaAuthor)
		.select()

	if (error) {
		throw error
	}

	return data
}
