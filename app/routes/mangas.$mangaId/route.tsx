import { LoaderFunctionArgs } from "@remix-run/node"
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react"
import { getMangaDetails } from "~/repositories/mangas"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"

export const loader = async (args: LoaderFunctionArgs) => {
	const { mangaId } = args.params

	if (!mangaId) {
		throw new Error("Manga id is required")
	}

	const { data, error } = await getMangaDetails(mangaId)

	if (error) {
		throw new Error(error.message)
	}

	return { manga: data }
}

export async function clientLoader({
	serverLoader,
	params,
}: ClientLoaderFunctionArgs) {
	const cacheKey = `/mangas/${params.mangaId}`
	const cache = sessionStorage.getItem(cacheKey)

	if (cache) return JSON.parse(cache)

	const { manga } = await serverLoader<typeof loader>()

	sessionStorage.setItem(cacheKey, JSON.stringify({ manga }))
	return { manga }
}

clientLoader.hydrate = true

export default function MangaId() {
	const { manga } = useLoaderData<typeof loader>()
	return (
		<div>
			<main className=" px-4 mx-auto py-6">
				<div className="grid lg:grid-cols-[1fr] gap-6 lg:gap-12 items-start">
					<Card className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-fit">
						<CardContent className="w-full lg:w-1/2">
							<img
								alt="Manga Cover"
								className="aspect-[2/3] h-[44rem] w-[28rem] object-cover border border-gray-200  rounded-lg overflow-hidden dark:border-gray-800"
								src={manga.cover}
							/>
						</CardContent>
						<CardContent className="w-full lg:w-1/2 space-y-2">
							<CardHeader className="font-bold text-3xl">
								{manga.title}
							</CardHeader>
							<h2 className="text-xl font-bold">Authors</h2>
							<nav className="flex gap-1">
								{manga.mangas_authors.map((ma) => (
									<Badge key={ma.authors?.id} className="text-sm font-medium">
										{ma.authors?.name}
									</Badge>
								))}
							</nav>
							<h2 className="text-xl font-bold">Tags</h2>
							<nav className="flex gap-1">
								{manga.mangas_tags.map((mt) => (
									<Badge key={mt.tags?.id} className="text-sm font-medium">
										{mt.tags?.title}
									</Badge>
								))}
							</nav>
							<h2 className="text-xl font-bold">Groups</h2>
							<nav className="flex gap-1">
								<Badge className="text-sm font-medium">Group 1</Badge>
								<Badge className="text-sm font-medium">Group 2</Badge>
								<Badge className="text-sm font-medium">Group 3</Badge>
							</nav>
							<h2 className="text-xl font-bold">Languages</h2>
							<nav className="flex gap-1">
								<Badge className="text-sm font-medium">Language 1</Badge>
								<Badge className="text-sm font-medium">Language 2</Badge>
								<Badge className="text-sm font-medium">Language 3</Badge>
							</nav>
							<h2 className="text-xl font-bold">Characters</h2>
							<nav className="flex gap-1">
								<Badge className="text-sm font-medium">Character 1</Badge>
								<Badge className="text-sm font-medium">Character 2</Badge>
								<Badge className="text-sm font-medium">Character 3</Badge>
							</nav>
							<h2 className="text-xl font-bold">Parodies</h2>
							<nav className="flex gap-1">
								<Badge className="text-sm font-medium">Parody 1</Badge>
								<Badge className="text-sm font-medium">Parody 2</Badge>
								<Badge className="text-sm font-medium">Parody 3</Badge>
							</nav>
							<h2 className="text-xl font-bold">Rating</h2>
							<nav className="flex gap-1">
								<Badge className="text-sm font-medium">4.5/5</Badge>
							</nav>
						</CardContent>
					</Card>
					<Card className="space-y-4">
						<CardContent>
							<CardHeader className="font-semibold text-2xl">
								Sample Pages
							</CardHeader>
							<div className="grid gap-2 md:grid-cols-5">
								{manga.pages.map((page) => (
									<div
										key={page.id}
										className="flex flex-col gap-4 items-center"
									>
										<img
											alt="Manga Page"
											className="aspect-[2/3] h-96  object-cover border border-gray-200 w-64 rounded-lg overflow-hidden dark:border-gray-800"
											height={125}
											src={page.image}
											width={75}
										/>
										<div>{page.page}</div>
									</div>
								))}
							</div>
							<Button className="mt-4 bg-black text-white w-full py-2 rounded-md">
								Read Now
							</Button>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
