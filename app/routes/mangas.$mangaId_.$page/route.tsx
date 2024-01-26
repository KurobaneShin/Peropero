import { defer, LoaderFunctionArgs } from "@remix-run/node"
import {
	Await,
	ClientLoaderFunctionArgs,
	Link,
	useLoaderData,
	useParams,
	useRouteLoaderData,
} from "@remix-run/react"
import { Suspense } from "react"
import { Skeleton } from "~/components/ui/skeleton"
import { supabase } from "~/infra/supabase"
import { getMangaDetails } from "~/repositories/mangas"

import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "~/components/ui/pagination"
import { Button } from "~/components/ui/button"
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

export const loader = (args: LoaderFunctionArgs) => {
	const { mangaId, page } = args.params

	if (!mangaId || !page) {
		throw new Error("Manga id and page is required")
	}

	const getPage = async () => {
		const { data, error } = await supabase
			.from("pages")
			.select("*")
			.eq("manga", Number(mangaId))
			.eq("page", Number(page))
			.maybeSingle()

		if (error) {
			throw error
		}

		return data
	}

	return defer(
		{ page: getPage(), manga: getMangaDetails(mangaId) },
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
	const cacheKey = `/mangas/${params.mangaId}/${params.page}`
	const cache = sessionStorage.getItem(cacheKey)

	if (cache) {
		return JSON.parse(cache)
	}

	const loaderData = await serverLoader<typeof loader>()

	const manga = await loaderData.manga
	const page = await loaderData.page
	sessionStorage.setItem(cacheKey, JSON.stringify({ manga, page }))
	return { manga, page }
}

clientLoader.hydrate = true

export default function handler() {
	const { page, manga } = useLoaderData<typeof loader>()

	const params = useParams()

	return (
		<div>
			<Suspense fallback={<Skeleton />}>
				<Await resolve={page}>
					{(page) => {
						return (
							<img
								alt="Manga Cover"
								className="aspect-[2/3] h-[44rem] w-[28rem] object-cover border border-gray-200  rounded-lg overflow-hidden dark:border-gray-800"
								src={page?.image}
							/>
						)
					}}
				</Await>
			</Suspense>

			<Suspense fallback={<Skeleton />}>
				<Await resolve={manga}>
					{(manga) => {
						const firstPage = manga?.pages?.[0]?.page
						const lastPage = manga?.pages?.slice(-1)[0]?.page

						return (
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<Button variant="outline">
											<Link
												className="flex"
												to={`/mangas/${manga?.id}/${firstPage}`}>
												<ChevronLeft />
												<ChevronLeft className="ml-[-2rem]" />
											</Link>
										</Button>
									</PaginationItem>

									<PaginationItem>
										<Button
											variant="outline"
											disabled={Number(params.page) === firstPage}>
											<Link
												to={`/mangas/${manga?.id}/${Number(params.page) - 1}`}>
												Previous
											</Link>
										</Button>
									</PaginationItem>

									<PaginationItem>
										<Button
											variant="outline"
											disabled={Number(params.page) === lastPage}>
											<Link
												to={`/mangas/${manga?.id}/${Number(params.page) + 1}`}>
												Next
											</Link>
										</Button>
									</PaginationItem>

									<PaginationItem>
										<Button variant="outline">
											<Link
												className="flex"
												to={`/mangas/${manga?.id}/${lastPage}`}>
												<ChevronRight className="mr-[-2rem]" />
												<ChevronRight />
											</Link>
										</Button>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						)
					}}
				</Await>
			</Suspense>
		</div>
	)
}
