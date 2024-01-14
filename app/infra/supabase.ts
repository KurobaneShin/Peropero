import { createClient } from "@supabase/supabase-js"
import { Database } from "database.types"
const supabaseUrl = "http://localhost:54321"
if (!process.env.ANON_KEY) throw "SUPABASE_KEY is not set"

const supabaseKey = process.env.ANON_KEY
// console.log(supabaseKey);
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

const serviceRoleKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"

export const superSupabase = createClient<Database>(supabaseUrl, serviceRoleKey)
