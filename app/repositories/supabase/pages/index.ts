import { supabase } from "~/infra/supabase"

export const getPage = async ({
	mangaId,
	page,
}: {
	mangaId: string
	page: string
}) => {
	const { data, error } = await supabase
		.from("pages")
		.select("*")
		.eq("manga", Number(mangaId))
		.eq("page", Number(page))
		.maybeSingle()

	if (error) {
		throw error
	}

	return data
}
