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

export const selectAllAuthorsAsSelect = async () => {
	const data = await supabase.from("authors").select("*")

	return (
		data.data?.map((author) => ({
			value: author.id.toString(),
			label: author.name,
		})) || []
	)
}

export async function deleteAuthor(authorId: string | number) {
	const { error } = await supabase.from("authors").delete().eq("id", authorId)

	if (error) {
		throw error
	}

	return true
}

export async function selectLastInsertedAuthor() {
	const { data, error } = await supabase
		.from("authors")
		.select("*")
		.order("id", { ascending: false })
		.limit(1)
		.maybeSingle()

	if (error || !data) {
		throw new Error("No author found")
	}

	return data
}
