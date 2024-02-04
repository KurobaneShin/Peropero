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
		.from("tags")
		.select("*,mangas_tags(mangas(id))")

	if (error) {
		throw error.message
	}

	return { tags: data }
}
export default function Tags() {
	const { tags } = useLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<Page>
			<Card>
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl">Tags</CardTitle>
						{!pathname.includes("new") && (
							<Link to="new">
								<Button>New Tag</Button>
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
							{tags.map((tag) => (
								<TableRow key={tag.id}>
									<TableCell>{tag.title}</TableCell>
									<TableCell>{tag.mangas_tags.length}</TableCell>
									<TableCell className="text-right">
										<Link to={`/tags/${tag.id}`}>Visit</Link>
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
