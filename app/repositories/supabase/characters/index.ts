import { supabase } from "~/infra/supabase"

export async function getCharacterById(characterId: string) {
	const { data, error } = await supabase
		.from("characters")
		.select("*")
		.eq("id", characterId)
		.maybeSingle()

	if (error || !data) {
		throw error || new Error("Character not found")
	}

	return data
}
