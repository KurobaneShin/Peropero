import { defer, LoaderFunctionArgs } from "@remix-run/node"
import { Await, useLoaderData } from "@remix-run/react"
import { Suspense } from "react"
import Page from "~/components/custom/Page"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { supabase } from "~/infra/supabase"
import { AlbumArtwork } from "../_index/components/album"

async function getMangasBuAuthorId(authorId: string) {
	const { data, error } = await supabase
		.from("mangas")
		.select("*,pages(*),mangas_authors(authors(*))")
		.eq("mangas_authors.author", authorId)

	if (error) {
		throw error
	}

	return data
}

export const loader = (args: LoaderFunctionArgs) => {
	const authorId = args.params.authorId

	if (!authorId) {
		throw new Error("Author ID is required")
	}

	const mangasPromise = getMangasBuAuthorId(authorId)

	return defer({
		mangasPromise,
	})
}

export default function AuthorId() {
	const { mangasPromise } = useLoaderData<typeof loader>()
	return (
		<Page>
			<Card>
				<CardHeader>
					<CardTitle>Author</CardTitle>
				</CardHeader>
				<CardContent>
					<Suspense fallback={"carregando"}>
						<Await resolve={mangasPromise}>
							{(mangas) => (
								<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
									{mangas.map((manga) => (
										<div key={manga.id}>
											<AlbumArtwork
												id={manga.id.toString()}
												width={200}
												height={300}
												aspectRatio="portrait"
												className="w-[250px]"
												album={{
													id: manga.id.toString(),
													cover: manga.cover,
													title: manga.title,
													artist: "",
												}}
											/>
										</div>
									))}
								</div>
							)}
						</Await>
					</Suspense>
				</CardContent>
			</Card>
		</Page>
	)
}
