import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react"
import { supabase } from "~/infra/supabase"

export const loader = async () => {
	const { data, error } = await supabase
		.from("authors")
		.select("*,mangas_authors(mangas(id))")

	if (error) {
		throw error
	}

	return { authors: data }
}
export default function Authors() {
	const { authors } = useLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<div>
			<div className="flex items-center justify-between">
				<h1>Authors</h1>
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
					{authors.map((author) => (
						<tr key={author.id}>
							<td>{author.name}</td>
							<td>{author.mangas_authors.length}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
