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
		<Page>
			<Card>
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl">Authors</CardTitle>
						{!pathname.includes("new") && (
							<Link to="new">
								<Button>New Author</Button>
							</Link>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Name</TableHead>
								<TableHead>Mangas</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{authors.map((author) => (
								<TableRow key={author.id}>
									<TableCell>{author.name}</TableCell>
									<TableCell>{author.mangas_authors.length}</TableCell>
									<TableCell className="text-right">
										<Link to={`${author.id}`}>Visit</Link>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Outlet />
		</Page>
	)
}
