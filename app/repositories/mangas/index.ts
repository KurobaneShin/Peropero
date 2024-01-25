import { supabase } from "~/infra/supabase"

export const getMangaDetails = async (mangaId: string) => {
	const { data, error } = await supabase
		.from("mangas")
		.select("*,pages(*),mangas_tags(tags(*)),mangas_authors(authors(*))")
		.eq("id", Number(mangaId))
		.order("page", {
			ascending: true,
			referencedTable: "pages",
		})

	if (error) {
		throw error.message
	}

	return data[0]
}
