import { supabase } from "~/infra/supabase"

export async function insertMangaTags({
	mangaId,
	tags,
}: {
	tags: string | string[]
	mangaId: string | number
}) {
	const authorsToInsert = Array.isArray(tags) ? tags : [tags]

	const mangaTags = authorsToInsert.map((tagId) => ({
		tag: Number(tagId),
		manga: Number(mangaId),
	}))

	const { data, error } = await supabase
		.from("mangas_tags")
		.insert(mangaTags)
		.select()

	if (error) {
		throw error
	}

	return data
}
