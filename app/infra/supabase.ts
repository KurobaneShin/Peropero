import { createClient } from "@supabase/supabase-js"
import { Database } from "database.types"
const supabaseUrl = "http://localhost:54321"
if (!process.env.ANON_KEY) throw "SUPABASE_KEY is not set"

const supabaseKey = process.env.ANON_KEY
// console.log(supabaseKey);
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
