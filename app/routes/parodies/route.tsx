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
		.from("parodies")
		.select("*,mangas_parodies(mangas(id))")

	if (error) {
		throw error
	}

	return { parodies: data }
}
export default function Parodies() {
	const { parodies } = useLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<Page>
			<Card>
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-between">
						<CardTitle className="text-2xl">Parodies</CardTitle>
						{!pathname.includes("new") && (
							<Link to="new">
								<Button>New Parody</Button>
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
							{parodies.map((parody) => (
								<TableRow key={parody.id}>
									<TableCell>{parody.title}</TableCell>
									<TableCell>{parody.mangas_parodies.length}</TableCell>
									<TableCell className="text-right">
										<Link to={`/parodies/${parody.id}`}>Visit</Link>
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
