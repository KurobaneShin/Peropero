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
import {
	getLanguageById,
	getMangasByCharacterId,
} from "~/repositories/supabase"
import { AlbumArtwork } from "../_index/components/album"

export const loader = async (args: LoaderFunctionArgs) => {
	const languageId = args.params.languageId

	if (!languageId) {
		throw new Error("Author ID is required")
	}

	const mangasPromise = getMangasByCharacterId(languageId)
	const language = await getLanguageById(languageId)

	return defer(
		{
			mangasPromise,
			language,
		},
		{
			headers: {
				"Cache-Control": "max-age=60, public",
			},
		},
	)
}

export async function clientLoader(args: ClientLoaderFunctionArgs) {
	const cacheKey = `/languages/${args.params.languageId}`
	return defaultClientCache(cacheKey, args)
}

clientLoader.hydrate = true

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `language | ${data?.language?.title}` },
		{ name: "description", content: `${data?.language?.title}` },
	]
}

export default function LanguageId() {
	const { mangasPromise, language } = useLoaderData<typeof loader>()
	return (
		<Page>
			<Card>
				<CardHeader>
					<CardTitle>{language.title}</CardTitle>
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
