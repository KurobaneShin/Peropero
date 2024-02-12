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

export const insertPages = async ({
	mangaId,
	images,
}: {
	mangaId: string | number
	images: string[]
}) => {
	const pagesInsert = images.map((page, idx) => ({
		page: idx + 1,
		manga: Number(mangaId),
		image: `${process.env.SUPABASE_URL}/storage/v1/object/public/pages/${page}`,
	}))

	const { data, error } = await supabase.from("pages").insert(pagesInsert)

	if (error) {
		throw error
	}

	return data
}
