import { defer, LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import {
	Await,
	ClientLoaderFunctionArgs,
	useLoaderData,
} from "@remix-run/react"
import { Suspense } from "react"
import Page from "~/components/custom/Page"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { AlbumArtwork } from "../_index/components/album"
import { getAuthorById, getMangasBuAuthorId } from "~/repositories/supabase"
import { defaultClientCache } from "~/lib/defaultClientCache"

export const loader = async (args: LoaderFunctionArgs) => {
	const authorId = args.params.authorId

	if (!authorId) {
		throw new Error("Author ID is required")
	}

	const mangasPromise = getMangasBuAuthorId(authorId)
	const author = await getAuthorById(authorId)

	return defer(
		{
			mangasPromise,
			author,
		},
		{
			headers: {
				"Cache-Control": "max-age=60, public",
			},
		},
	)
}

export async function clientLoader(args: ClientLoaderFunctionArgs) {
	const cacheKey = `/authors/${args.params.authorId}`
	return defaultClientCache(cacheKey, args)
}

clientLoader.hydrate = true

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `author | ${data?.author?.name}` },
		{ name: "description", content: `${data?.author?.name}` },
	]
}

export default function AuthorId() {
	const { mangasPromise, author } = useLoaderData<typeof loader>()
	return (
		<Page>
			<Card>
				<CardHeader>
					<CardTitle>{author.name}</CardTitle>
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
