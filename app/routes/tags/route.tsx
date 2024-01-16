import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react"
import { supabase } from "~/infra/supabase"

export const loader = async () => {
	const { data, error } = await supabase
		.from("tags")
		.select("*,mangas_tags(mangas(id))")

	if (error) {
		throw error.message
	}

	return { tags: data }
}
export default function Authors() {
	const { tags } = useLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<div>
			<div className="flex items-center justify-between">
				<h1>Tags</h1>
				{!pathname.includes("new") && (
					<div>
						<Link to="new">Add</Link>
					</div>
				)}
			</div>

			<Outlet />

			<table className="mt-4">
				<thead>
					<tr>
						<th>Nome</th>
						<th>Obras</th>
					</tr>
				</thead>
				<tbody>
					{tags.map((tag) => (
						<tr key={tag.id}>
							<td>{tag.title}</td>
							<td>{tag.mangas_tags.length}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
