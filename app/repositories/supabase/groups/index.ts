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

export async function selectAllGroupAsSelect() {
	const data = await supabase.from("groups").select("*")

	return (
		data.data?.map((group) => ({
			value: group.id.toString(),
			label: group.title,
		})) || []
	)
}
