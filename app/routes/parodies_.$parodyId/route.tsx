import {
	Await,
	ClientLoaderFunctionArgs,
	useLoaderData,
} from "@remix-run/react"
import { LoaderFunctionArgs, MetaFunction, defer } from "@vercel/remix"
import { Suspense } from "react"
import Page from "~/components/custom/Page"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { defaultClientCache } from "~/lib/defaultClientCache"
import { getMangasByParodyId, getParodyById } from "~/repositories/supabase"
import { AlbumArtwork } from "../_index/components/album"

export const loader = async (args: LoaderFunctionArgs) => {
	const parodyId = args.params.parodyId

	if (!parodyId) {
		throw new Error("Author ID is required")
	}

	const mangasPromise = getMangasByParodyId(parodyId)
	const parody = await getParodyById(parodyId)

	return defer(
		{
			mangasPromise,
			parody,
		},
		{
			headers: {
				"Cache-Control": "max-age=60, public",
			},
		},
	)
}

export async function clientLoader(args: ClientLoaderFunctionArgs) {
	const cacheKey = `/parodies/${args.params.parodyId}`
	return defaultClientCache(cacheKey, args)
}

clientLoader.hydrate = true

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `parody | ${data?.parody?.title}` },
		{ name: "description", content: `${data?.parody?.title}` },
	]
}

export default function ParodyId() {
	const { mangasPromise, parody } = useLoaderData<typeof loader>()
	return (
		<Page>
			<Card>
				<CardHeader>
					<CardTitle>{parody?.title}</CardTitle>
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
