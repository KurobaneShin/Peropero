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
import { getGroupById, getMangasByGroupId } from "~/repositories/supabase"
import { AlbumArtwork } from "../_index/components/album"

export const loader = async (args: LoaderFunctionArgs) => {
	const groupId = args.params.groupId

	if (!groupId) {
		throw new Error("Author ID is required")
	}

	const mangasPromise = getMangasByGroupId(groupId)
	const group = await getGroupById(groupId)

	return defer({
		mangasPromise,
		group,
	})
}

export async function clientLoader(args: ClientLoaderFunctionArgs) {
	const cacheKey = `/groups/${args.params.groupId}`
	return defaultClientCache(cacheKey, args)
}

clientLoader.hydrate = true

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{ title: `group | ${data?.group?.title}` },
		{ name: "description", content: `${data?.group?.title}` },
	]
}

export default function group() {
	const { mangasPromise, group } = useLoaderData<typeof loader>()
	return (
		<Page>
			<Card>
				<CardHeader>
					<CardTitle>{group?.title}</CardTitle>
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
