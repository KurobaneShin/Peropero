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
	getCharacterById,
	getMangasByCharacterId,
} from "~/repositories/supabase"
import { AlbumArtwork } from "../_index/components/album"

export const loader = async (args: LoaderFunctionArgs) => {
	const characterId = args.params.characterId

	if (!characterId) {
		throw new Error("Character ID is required")
	}

	const mangasPromise = getMangasByCharacterId(characterId)
	const character = await getCharacterById(characterId)

	return defer(
		{
			mangasPromise,
			character,
		},
		{
			headers: {
				"Cache-Control": "max-age=60, public",
			},
		},
	)
}

export async function clientLoader(args: ClientLoaderFunctionArgs) {
	const cacheKey = `/characters/${args.params.characterId}`
	return defaultClientCache(cacheKey, args)
}

clientLoader.hydrate = true

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `character | ${data?.character?.name}` },
		{ name: "description", content: `${data?.character?.name}` },
	]
}

export default function CharacterId() {
	const { mangasPromise, character } = useLoaderData<typeof loader>()
	return (
		<Page>
			<Card>
				<CardHeader>
					<CardTitle>{character.name}</CardTitle>
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
