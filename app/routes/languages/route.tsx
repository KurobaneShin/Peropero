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
		.from("languages")
		.select("*,mangas_languages(mangas(id))")

	if (error) {
		throw error.message
	}

	return { languages: data }
}
export default function Languages() {
	const { languages } = useLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<Page>
			<Card>
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl">Languages</CardTitle>
						{!pathname.includes("new") && (
							<Link to="new">
								<Button>New Language</Button>
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
							{languages.map((character) => (
								<TableRow key={character.id}>
									<TableCell>{character.title}</TableCell>
									<TableCell>{character.mangas_languages.length}</TableCell>
									<TableCell className="text-right">
										<Link to={`/languages/${character.id}`}>Visit</Link>
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
