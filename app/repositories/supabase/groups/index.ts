import { supabase } from "~/infra/supabase"

export async function insertMangaGroups({
	mangaId,
	groups,
}: {
	groups: string | string[]
	mangaId: string | number
}) {
	const authorsToInsert = Array.isArray(groups) ? groups : [groups]

	const mangaGroups = authorsToInsert.map((groupId) => ({
		groupid: Number(groupId),
		manga: Number(mangaId),
	}))

	const { data, error } = await supabase
		.from("mangas_groups")
		.insert(mangaGroups)
		.select()

	if (error) {
		throw error
	}

	return data
}
