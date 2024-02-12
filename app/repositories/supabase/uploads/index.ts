import { supabase } from "~/infra/supabase"

export async function handlePageUploads(
	files: {
		file: Blob
		page: number | string
	}[],
) {
	const filesPromises = files.map((file) =>
		supabase.storage
			.from("pages")
			.upload(`pages-${Math.random().toString(36).substring(7)}`, file.file)
			.then((res) => {
				if (res.error) throw res.error
				return {
					page: file.page,
					url: res.data.path,
				}
			}),
	)

	const results = await Promise.all(filesPromises)

	return results
}

export async function handleCoverUpload(file: Blob) {
	const { data, error } = await supabase.storage
		.from("covers")
		.upload(`covers-${Math.random().toString(36).substring(7)}`, file)

	if (error) {
		throw error
	}

	return data.path
}
