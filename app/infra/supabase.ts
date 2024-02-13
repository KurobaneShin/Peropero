import { createClient } from "@supabase/supabase-js"
import { Database } from "database.types"

const supabaseUrl = process.env.SUPABASE_URL
if (!process.env.ANON_KEY) {
	throw "SUPABASE_KEY is not set"
}
if (!supabaseUrl) {
	throw "SUPABASE_URL is not set"
}

const supabaseKey = process.env.ANON_KEY
// console.log(supabaseKey);
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

const serviceRoleKey = process.env.SERVICE_ROLE_KEY
if (!serviceRoleKey) {
	throw "SERVICE_ROLE_KEY is not set"
}

export const superSupabase = createClient<Database>(supabaseUrl, serviceRoleKey)
