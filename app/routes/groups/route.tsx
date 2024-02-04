import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react"
import { supabase } from "~/infra/supabase"

export const loader = async () => {
	const { data, error } = await supabase
		.from("groups")
		.select("*,mangas_groups(mangas(id))")

	if (error) {
		throw error
	}

	return { groups: data }
}
export default function Groups() {
	const { groups } = useLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<div>
			<div className="flex items-center justify-between">
				<h1>Groups</h1>
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
					{groups.map((group) => (
						<tr key={group.id}>
							<td>{group.title}</td>
							<td>{group.mangas_groups.length}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
