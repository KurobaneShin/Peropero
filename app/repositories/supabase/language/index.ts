import { supabase } from "~/infra/supabase"

export async function getLanguageById(languageId: string) {
	const { data, error } = await supabase
		.from("languages")
		.select("*")
		.eq("id", languageId)
		.maybeSingle()

	if (error || !data) {
		throw error || new Error("Language not found")
	}

	return data
}
