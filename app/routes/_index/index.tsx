import { Separator } from "@radix-ui/react-separator"
import type { MetaFunction } from "@remix-run/node"
import { Button } from "~/components/ui/button"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { AlbumArtwork } from "./components/album"
import { mangas } from "./data/mangas"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { Sidebar } from "./components/sidebar"
import { supabase } from "~/infra/supabase"

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	]
}

export const loader = async () => {
	const { data, error } = await supabase
		.from("mangas")
		.select("*,mangas_authors(authors(*))")

	if (error) {
		console.log(error)
		throw error
	}
	console.log(data[0].mangas_authors[0].authors?.name)
	return { mangas: data }
}

export default function Index() {
	const { mangas } = useLoaderData<typeof loader>()
	const navigate = useNavigate()
	return (
		<>
			<div className="hidden md:block">
				<div className="border-t">
					<div className="bg-background">
						<div className="grid lg:grid-cols-4">
							<div className="col-span-3 lg:col-span-4 lg:border-l">
								<div className="h-full px-4 py-6 lg:px-8">
									<Tabs defaultValue="manga" className="h-full space-y-6">
										<div className="space-between flex items-center">
											<TabsList>
												<TabsTrigger value="manga" className="relative">
													Mangas
												</TabsTrigger>
												<TabsTrigger value="anime" disabled>
													Animes
												</TabsTrigger>
											</TabsList>
											<div className="ml-auto mr-4">
												<Button onClick={() => navigate("new")}>
													{/*<PlusCircledIcon className="mr-2 h-4 w-4" />*/}
													Adicionar
												</Button>
											</div>
										</div>
										<TabsContent
											value="manga"
											className="border-none p-0 outline-none"
										>
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
											<div className="relative">
												<ScrollArea>
													<div className="flex space-x-4 pb-4">
														{mangas.map((album) => (
															<AlbumArtwork
																key={album.title}
																album={{
																	...album,
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
											<div className="mt-6 space-y-1">
												<h2 className="text-2xl font-semibold tracking-tight">
													Recentemente adicionados
												</h2>
											</div>
											<Separator className="my-4" />
											<div className="relative">
												<ScrollArea>
													<div className="flex space-x-4 pb-4">
														{mangas.map((album) => (
															<AlbumArtwork
																key={album.title}
																album={{
																	...album,
																	artist:
																		album.mangas_authors?.[0]?.authors?.name ||
																		"",
																}}
																className="w-[150px]"
																aspectRatio="portrait"
																width={150}
																height={150}
															/>
														))}
													</div>
													<ScrollBar orientation="horizontal" />
												</ScrollArea>
											</div>
										</TabsContent>
										<TabsContent
											value="anime"
											className="h-full flex-col border-none p-0 data-[state=active]:flex"
										>
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<h2 className="text-2xl font-semibold tracking-tight">
														New Episodes
													</h2>
													<p className="text-sm text-muted-foreground">
														Your favorite podcasts. Updated daily.
													</p>
												</div>
											</div>
											<Separator className="my-4" />
											{/*
											<PodcastEmptyPlaceholder />
                      */}
										</TabsContent>
									</Tabs>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
