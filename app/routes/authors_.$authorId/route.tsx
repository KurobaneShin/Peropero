import { defer, LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import {
	Await,
	ClientLoaderFunctionArgs,
	useLoaderData,
} from "@remix-run/react"
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

async function getAuthorById(authorId: string) {
	const { data, error } = await supabase
		.from("authors")
		.select("*")
		.eq("id", authorId)
		.maybeSingle()

	if (error) {
		throw error
	}

	return data
}

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
				"Cache-Control": "max-age=3600, public",
			},
		},
	)
}

export async function clientLoader({
	serverLoader,
	params,
}: ClientLoaderFunctionArgs) {
	const cacheKey = `/authors/${params.authorId}`

	const cache = sessionStorage.getItem(cacheKey)

	if (cache) {
		return JSON.parse(cache)
	}

	const loaderData = await serverLoader<typeof loader>()

	const author = loaderData.author
	const mangasPromise = await loaderData.mangasPromise

	sessionStorage.setItem(cacheKey, JSON.stringify({ mangasPromise, author }))

	return { mangasPromise, author }
}

clientLoader.hydrate = true

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `${data?.author?.name}` },
		{ name: "description", content: `${data?.author?.name}` },
	]
}

export default function AuthorId() {
	const { mangasPromise, author } = useLoaderData<typeof loader>()
	return (
		<Page>
			<Card>
				<CardHeader>
					<CardTitle>{author?.name}</CardTitle>
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
