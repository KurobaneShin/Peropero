import { Separator } from "@radix-ui/react-separator"
import type { MetaFunction } from "@remix-run/node"

import { defer } from "@remix-run/node"
import {
	Await,
	ClientLoaderFunctionArgs,
	Link,
	useLoaderData,
} from "@remix-run/react"
import { PlusCircleIcon } from "lucide-react"
import { Suspense } from "react"
import { Button } from "~/components/ui/button"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { supabase } from "~/infra/supabase"
import { AlbumArtwork } from "./components/album"

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	]
}

// biome-ignore lint/nursery/useAwait: <explanation>
export const loader = async () => {
	const getMangas = async () => {
		const { data, error } = await supabase
			.from("mangas")
			.select("*,pages(*),mangas_authors(authors(*))")
			.limit(6)

		if (error) {
			throw error
		}
		return data
	}
	const getNewestMangas = async () => {
		const { data, error } = await supabase
			.from("mangas")
			.select("*,pages(*),mangas_authors(authors(*))")
			.order("created_at", {
				ascending: false,
			})
			.limit(20)

		if (error) {
			throw error
		}
		return data
	}

	return defer({ mangas: getMangas(), newestMangas: getNewestMangas() })
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
	const cacheKey = "/root"
	const cache = sessionStorage.getItem(cacheKey)

	if (cache) {
		return JSON.parse(cache)
	}

	const loaderData = await serverLoader<typeof loader>()

	const newestMangas = await loaderData.newestMangas
	const mangas = await loaderData.mangas

	sessionStorage.setItem(cacheKey, JSON.stringify({ mangas, newestMangas }))
	return { mangas, newestMangas }
}

clientLoader.hydrate = true

export default function Index() {
	const { mangas, newestMangas } = useLoaderData<typeof loader>()
	return (
		<div className="grid lg:grid-cols-4">
			<div className="col-span-3 lg:col-span-4 border-l">
				<div className="h-full px-4 py-6 lg:px-8">
					<Tabs defaultValue="mangas" className="h-full space-y-6">
						<div className="space-between flex items-center">
							<TabsList>
								<TabsTrigger value="mangas" className="relative">
									Mangas
								</TabsTrigger>
								<TabsTrigger value="animes" disabled={true}>
									Animes
								</TabsTrigger>
								<TabsTrigger value="games" disabled={true}>
									Games
								</TabsTrigger>
							</TabsList>
							<div className="ml-auto mr-4">
								<Link to="/new">
									<Button>
										<PlusCircleIcon className="mr-2 h-4 w-4" />
										Add
									</Button>
								</Link>
							</div>
						</div>
						<TabsContent
							value="mangas"
							className="border-none p-0 outline-none">
							<div className="flex items-center justify-between">
								<div className="space-y-1">
									<h2 className="text-2xl font-semibold tracking-tight">
										Popular
									</h2>
									<p className="text-sm text-muted-foreground">
										Top picks for you. Updated daily.
									</p>
								</div>
							</div>
							<Separator className="my-4" />
							<Suspense fallback={<div>Loading...</div>}>
								<Await resolve={mangas}>
									{(mangasList) => (
										<div className="relative">
											<ScrollArea className="w-80 md:w-1/2 lg:w-full">
												<div className="flex space-x-4 pb-4">
													{mangasList.map((album) => (
														<AlbumArtwork
															key={album.id.toString()}
															pages={album.pages}
															album={{
																title: album.title,
																id: album.id.toString(),
																cover: album.cover,
																artist:
																	album.mangas_authors?.[0]?.authors?.name ||
																	"",
															}}
															className="w-[250px]"
															aspectRatio="portrait"
															width={250}
															height={330}
														/>
													))}
												</div>
												<ScrollBar orientation="horizontal" />
											</ScrollArea>
										</div>
									)}
								</Await>
							</Suspense>
							<div className="mt-6 space-y-1">
								<h2 className="text-2xl font-semibold tracking-tight">
									Recently Added
								</h2>
							</div>
							<Separator className="my-4" />
							<Suspense fallback={<div>Loading...</div>}>
								<Await resolve={newestMangas}>
									{(mangasList) => (
										<div className="relative">
											<ScrollArea className="w-80 md:w-1/2 lg:w-full">
												<div className="flex space-x-4 pb-4">
													{mangasList.map((album) => (
														<AlbumArtwork
															key={album.id.toString()}
															album={{
																title: album.title,
																id: album.id.toString(),
																cover: album.cover,
																artist:
																	album.mangas_authors?.[0]?.authors?.name ||
																	"",
															}}
															pages={album.pages}
															className="w-[250px]"
															aspectRatio="square"
															width={250}
															height={330}
														/>
													))}
												</div>
												<ScrollBar orientation="horizontal" />
											</ScrollArea>
										</div>
									)}
								</Await>
							</Suspense>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}
