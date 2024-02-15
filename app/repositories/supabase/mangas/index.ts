import { supabase } from "~/infra/supabase"

export const getMangaDetails = async (mangaId: string) => {
	const { data, error } = await supabase
		.from("mangas")
		.select(
			"*,pages(*),mangas_tags(tags(*)),mangas_authors(authors(*)),mangas_groups(groups(*))",
		)
		.eq("id", Number(mangaId))
		.order("page", {
			ascending: true,
			referencedTable: "pages",
		})
		.maybeSingle()

	if (error || !data) {
		throw error?.message || "Manga not found"
	}

	return data
}

export async function getMangasBuAuthorId(authorId: string) {
	const { data, error } = await supabase
		.from("mangas")
		.select("*,pages(*),mangas_authors!inner(authors(*))")
		.eq("mangas_authors.author", authorId)

	if (error) {
		throw error
	}

	return data
}

export const getMangasByTagId = async (tagId: string) => {
	const { data, error } = await supabase
		.from("mangas")
		.select("*,pages(*),mangas_tags!inner(tags(*))")
		.eq("mangas_tags.tag", tagId)

	if (error) {
		throw error.message
	}

	return data
}

export const getMangas = async () => {
	const { data, error } = await supabase
		.from("mangas")
		.select("*,pages(*),mangas_authors(authors(*))")
		.limit(6)

	if (error) {
		throw error
	}
	return data
}

export const getMangasByGroupId = async (groupId: string) => {
	const { data, error } = await supabase
		.from("mangas")
		.select("*,pages(*),mangas_groups!inner(groups(*))")
		.eq("mangas_groups.groupid", groupId)

	if (error) {
		throw error.message
	}

	return data
}
export const getNewestMangas = async () => {
	const { data, error } = await supabase
		.from("mangas")
		.select("*,pages(*),mangas_authors(authors(*))")
		.order("created_at", {
			ascending: false,
		})
		.limit(20)

	if (error) {
		throw error
	}
	return data
}

export const getMangaTitle = async (mangaId: string) => {
	const { data, error } = await supabase
		.from("mangas")
		.select("title")
		.eq("id", Number(mangaId))
		.maybeSingle()

	if (!data || error) {
		throw new Error("Manga not found")
	}

	return data
}

export const createManga = async ({
	title,
	coverUpload,
}: {
	title: string
	coverUpload: string
}) => {
	const { data: newManga, error: mangaError } = await supabase
		.from("mangas")
		.insert({
			title,
			cover: `${process.env.SUPABASE_URL}/storage/v1/object/public/covers/${coverUpload}`,
		})
		.select()
		.maybeSingle()

	if (mangaError || !newManga) {
		throw mangaError
	}

	return newManga
}
