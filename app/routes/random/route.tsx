import { redirect } from "@vercel/remix"
import { supabase } from "~/infra/supabase"

export const loader = async () => {
	const { count } = await supabase.from("mangas").select("*", {
		count: "exact",
		head: true,
	})

	const randomId = Math.floor(Math.random() * (count ?? 0)) + 1

	const { data } = await supabase
		.from("mangas")
		.select("*")
		.limit(1)
		.eq("id", randomId)
		.maybeSingle()

	return redirect(`/mangas/${data?.id}`)
}
