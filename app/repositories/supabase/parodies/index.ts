import { supabase } from "~/infra/supabase"

export const getParodyById = async (parodyId: string) => {
	const { data, error } = await supabase
		.from("parodies")
		.select("*")
		.eq("id", parodyId)
		.maybeSingle()

	if (error || !data) {
		throw error || new Error("Parody not found")
	}

	return data
}
