import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react"
import Page from "~/components/custom/Page"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table"
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
		<Page>
			<Card>
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl">Groups</CardTitle>
						{!pathname.includes("new") && (
							<Link to="new">
								<Button>New Group</Button>
							</Link>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<Outlet />

					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Name</TableHead>
								<TableHead>Mangas</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{groups.map((group) => (
								<TableRow key={group.id}>
									<TableCell>{group.title}</TableCell>
									<TableCell>{group.mangas_groups.length}</TableCell>
									<TableCell className="text-right">
										<Link to={`/groups/${group.id}`}>Visit</Link>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</Page>
	)
}
