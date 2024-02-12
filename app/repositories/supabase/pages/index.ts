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
	pageData,
}: {
	mangaId: string | number
	pageData: {
		page: string | number
		url: string
	}[]
}) => {
	const pagesInsert = pageData.map((page) => ({
		page: Number(page.page),
		manga: Number(mangaId),
		image: `${process.env.SUPABASE_URL}/storage/v1/object/public/pages/${page.url}`,
	}))

	const { data, error } = await supabase.from("pages").insert(pagesInsert)

	if (error) {
		throw error
	}

	return data
}
