import {
	Await,
	ClientLoaderFunctionArgs,
	useLoaderData,
	useParams,
} from "@remix-run/react"
import { LoaderFunctionArgs, MetaFunction, defer } from "@vercel/remix"
import { Suspense } from "react"
import { Skeleton } from "~/components/ui/skeleton"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "~/components/ui/pagination"
import { defaultClientCache } from "~/lib/defaultClientCache"
import {
	getMangaDetails,
	getMangaTitle,
	getPage,
} from "~/repositories/supabase"
import { PageLink } from "./PageLink"

export const loader = async (args: LoaderFunctionArgs) => {
	const { mangaId, page } = args.params

	if (!(mangaId && page)) {
		throw new Error("Manga id and page is required")
	}

	const pagePromise = getPage({
		page,
		mangaId,
	})

	const data = await getMangaTitle(mangaId)

	return defer({
		title: data.title,
		page: pagePromise,
		manga: getMangaDetails(mangaId),
	})
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
	return [
		{ title: `${data?.title ?? "Manga"} | ${params.page}` },
		{ name: "description", content: `${data?.title} | ${params.page}` },
	]
}

export async function clientLoader(args: ClientLoaderFunctionArgs) {
	const cacheKey = `/mangas/${args.params.mangaId}/${args.params.page}`
	return defaultClientCache(cacheKey, args)
}

clientLoader.hydrate = true

export default function handler() {
	const { page, manga } = useLoaderData<typeof loader>()
	const params = useParams()

	return (
		<div className="mt-8 flex flex-col gap-4">
			<Suspense fallback={<Skeleton />}>
				<Await resolve={page}>
					{(page) => {
						return (
							<div className="mx-auto flex w-full justify-center">
								<img
									alt="Manga Cover"
									className="aspect-[2/3] h-[80rem] w-[52rem] object-cover border border-gray-200  rounded-lg overflow-hidden dark:border-gray-800"
									src={page?.image}
								/>
							</div>
						)
					}}
				</Await>
			</Suspense>

			<Suspense fallback={<Skeleton />}>
				<Await resolve={manga}>
					{(manga) => {
						const firstPage = manga?.pages?.[0]?.page
						const lastPage = manga?.pages?.slice(-1)[0]?.page

						const previous = Number(params.page) - 1
						const next = Number(params.page) + 1
						const mangaId = manga?.id.toString()

						return (
							<Pagination>
								<PaginationContent>
									<PaginationItem>
										<Button
											variant="outline"
											id="firstPage"
											aria-label="First Page"
											role="link"
											aria-labelledby="firstPage">
											<PageLink
												className="flex"
												page={firstPage}
												mangaId={mangaId}
												prefetch="render"
												image={manga?.pages?.[0]?.image}
												to={`/mangas/${mangaId}/${firstPage}`}>
												<ChevronLeft />
												<ChevronLeft className="ml-[-2rem]" />
											</PageLink>
										</Button>
									</PaginationItem>

									<PaginationItem>
										<Button
											variant="outline"
											disabled={Number(params.page) === firstPage}>
											<PageLink
												prefetch="render"
												page={previous}
												image={manga?.pages?.[previous]?.image}
												mangaId={mangaId}
												to={`/mangas/${mangaId}/${previous}`}>
												Previous
											</PageLink>
										</Button>
									</PaginationItem>

									<PaginationItem>
										<Button
											variant="outline"
											disabled={Number(params.page) === lastPage}>
											<PageLink
												prefetch="render"
												mangaId={mangaId}
												image={manga?.pages?.[next]?.image}
												page={next}
												to={`/mangas/${mangaId}/${next}`}>
												Next
											</PageLink>
										</Button>
									</PaginationItem>

									<PaginationItem>
										<Button
											variant="outline"
											id="lastPage"
											aria-label="Last Page"
											role="link"
											aria-labelledby="lastPage">
											<PageLink
												page={lastPage}
												image={manga?.pages?.[lastPage]?.image}
												prefetch="render"
												mangaId={mangaId}
												className="flex"
												to={`/mangas/${mangaId}/${lastPage}`}>
												<ChevronRight className="mr-[-2rem]" />
												<ChevronRight />
											</PageLink>
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
