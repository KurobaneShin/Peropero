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
		.from("characters")
		.select("*,mangas_characters(mangas(id))")

	if (error) {
		throw error
	}

	return { characters: data }
}
export default function Characters() {
	const { characters } = useLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<Page>
			<Card>
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl">Characters</CardTitle>
						{!pathname.includes("new") && (
							<Link to="new">
								<Button>New Character</Button>
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
							{characters.map((character) => (
								<TableRow key={character.id}>
									<TableCell>{character.name}</TableCell>
									<TableCell>{character.mangas_characters.length}</TableCell>
									<TableCell className="text-right">
										<Link to={`/characters/${character.id}`}>Visit</Link>
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
