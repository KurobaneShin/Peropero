import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	defer,
	redirect,
} from "@remix-run/node"
import {
	Await,
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
	Form,
	Link,
	useActionData,
	useLoaderData,
	useLocation,
	useNavigation,
} from "@remix-run/react"
import React, { Suspense, useEffect, useState } from "react"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { FormControl } from "~/components/custom/FormControl"
import Page from "~/components/custom/Page"
import { Combobox } from "~/components/custom/multipleCombobox"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { useObjectUrls } from "~/hooks/useOjectUrls"
import { b64toBlob } from "~/lib/b64toBlob"
import { defaultClientCache } from "~/lib/defaultClientCache"
import { getUser } from "~/lib/getUser"
import { makeForm } from "~/lib/makeForm"
import { transformFilesToWebp } from "~/lib/transFilesToWebp"
import { transformFileToWebp } from "~/lib/transformFileToWebp"
import {
	createManga,
	handleCoverUpload,
	handlePageUploads,
	insertMangaAuthors,
	insertMangaTags,
	insertPages,
	selectAllAuthorsAsSelect,
	selectAllTagsAsSelect,
} from "~/repositories/supabase"
import {
	insertMangaGroups,
	selectAllGroupAsSelect,
} from "~/repositories/supabase/groups"
import { AlbumArtwork } from "./_index/components/album"

const { parse } = makeForm(
	z.object({
		title: zfd.text(),
		authors: z.array(z.string()).or(z.string()),
		tags: z.array(z.string()).or(z.string()),
		groups: z.array(z.string()).or(z.string()),
		file: z.array(
			z.object({
				page: z.string(),
				url: z.string(),
			}),
		),
		cover: z.string(),
	}),
)

export const loader = async (args: LoaderFunctionArgs) => {
	await getUser(args.request)

	return defer(
		{
			authors: selectAllAuthorsAsSelect(),
			tags: selectAllTagsAsSelect(),
			groups: selectAllGroupAsSelect(),
		},
		{
			headers: {
				"Cache-Control": "public, max-age=60, s-maxage=60",
			},
		},
	)
}

export const clientLoader = async (args: ClientLoaderFunctionArgs) =>
	defaultClientCache("/new", args)

clientLoader.hydrate = true

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		const { data, errors } = parse(await request.formData())

		if (errors) {
			return { errors }
		}

		const handlePagesb64ToBlob = async (
			pages: { page: number | string; url: string }[],
		) => {
			const promises = pages.map(async (page) => {
				const blob = await b64toBlob(page.url, "image/webp")
				return { page: page.page, file: blob }
			})

			const blobs = await Promise.all(promises)
			return blobs
		}

		const filesBlobs = await handlePagesb64ToBlob(data.file)

		const coverBlob = await b64toBlob(data.cover, "image/webp")

		const [uploadResults, coverUpload] = await Promise.all([
			handlePageUploads(filesBlobs),
			handleCoverUpload(coverBlob),
		])

		const newManga = await createManga({
			coverUpload,
			title: data.title,
		})

		const pagesInsertPromise = insertPages({
			mangaId: newManga.id,
			pageData: uploadResults,
		})

		const groupsInsertPromise = insertMangaGroups({
			groups: data.groups,
			mangaId: newManga.id,
		})

		const authorsInsertPromise = insertMangaAuthors({
			authors: data.authors,
			mangaId: newManga.id,
		})

		const tagsInsertPromise = insertMangaTags({
			mangaId: newManga.id,
			tags: data.tags,
		})

		await Promise.all([
			authorsInsertPromise,
			tagsInsertPromise,
			pagesInsertPromise,
			groupsInsertPromise,
		])

		return redirect(`/mangas/${newManga.id}`)
	} catch (e) {
		return {
			errors: {
				trueError: JSON.stringify((e as Record<string, string>).message),
			},
		}
	}
}

export const clientAction = async ({
	serverAction,
}: ClientActionFunctionArgs) => {
	sessionStorage.clear()
	const data = await serverAction()
	return data
}

export default function New() {
	const { authors, tags, groups } = useLoaderData<typeof loader>()
	const actionData = useActionData<typeof action>()

	const { pathname } = useLocation()

	const [files, setFiles] = useState<{ page: number; url: string }[]>([])

	const [cover, setCover] = useState<string>("")
	const [artists, setArtists] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [selectedGroups, setSelectedGroups] = useState<string[]>([])

	const [loadingPages, setLoadingPages] = useState<number>()
	const getObjectUrl = useObjectUrls()

	const transition = useNavigation()
	const isSubmitting = transition.state === "submitting"

	useEffect(() => {
		if (files.length === loadingPages) {
			setLoadingPages(undefined)
		}
	}, [files, loadingPages])

	const processPages = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			setLoadingPages(e.target.files.length + files.length)
			const filesArray = Array.from(e.target.files)

			const promises = filesArray.map((file, idx) => {
				return transformFilesToWebp(file, getObjectUrl, idx + 1)
			})

			const results = await Promise.all(promises)

			setFiles(results)
		}
	}

	return (
		<Page>
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">New Manga</CardTitle>
				</CardHeader>
				<CardContent>
					<Form
						method="post"
						action={pathname}
						encType="multipart/form-data"
						className="grid gap-4">
						<FormControl name="title" label="Title" errors={actionData?.errors}>
							<Input id="title" name="title" type="text" />
						</FormControl>

						<FormControl
							name="authors"
							label="Authors"
							errors={actionData?.errors}>
							<Suspense fallback={<div>Loading...</div>}>
								<Await resolve={authors}>
									{(authorsList) => (
										<Combobox
											options={authorsList}
											clearable={true}
											value={artists}
											multiple={true}
											onValueChange={(v) => {
												setArtists(v)
											}}
										/>
									)}
								</Await>
							</Suspense>
							<p className="text-sm text-muted-foreground">
								Arthist no found? <Link to="/authors/new">click here!</Link> to
								add
							</p>
							{artists.map((artist) => (
								<input
									key={artist}
									type="hidden"
									name="authors"
									value={artist}
								/>
							))}
						</FormControl>

						<FormControl name="tags" label="Tags" errors={actionData?.errors}>
							<Suspense fallback={<div>Loading...</div>}>
								<Await resolve={tags}>
									{(tagsList) => (
										<Combobox
											options={tagsList}
											clearable={true}
											value={selectedTags}
											multiple={true}
											onValueChange={(v) => {
												setSelectedTags(v)
											}}
										/>
									)}
								</Await>
							</Suspense>

							{selectedTags.map((tag) => (
								<input key={tag} type="hidden" name="tags" value={tag} />
							))}

							<p className="text-sm text-muted-foreground">
								Tag no found? <Link to="/tags/new">click here!</Link> to add
							</p>
						</FormControl>

						<FormControl
							name="groups"
							label="Groups"
							errors={actionData?.errors}>
							<Suspense fallback={<div>Loading...</div>}>
								<Await resolve={groups}>
									{(groupsList) => (
										<Combobox
											options={groupsList}
											clearable={true}
											value={selectedGroups}
											multiple={true}
											onValueChange={(v) => {
												setSelectedGroups(v)
											}}
										/>
									)}
								</Await>
							</Suspense>

							{selectedGroups.map((group) => (
								<input key={group} type="hidden" name="groups" value={group} />
							))}

							<p className="text-sm text-muted-foreground">
								Tag no found? <Link to="/tags/new">click here!</Link> to add
							</p>
						</FormControl>

						<FormControl name="cover" label="Cover" errors={actionData?.errors}>
							<Input
								type="file"
								onChange={(e) => {
									if (e.target.files?.length) {
										transformFileToWebp(
											e.target.files[0],
											getObjectUrl,
											setCover,
										)
									}
								}}
							/>
						</FormControl>

						<div className="flex flex-row space-x-4 flex-wrap">
							{cover.length > 0 && (
								<>
									<Button type="button" onClick={() => setCover("")}>
										Clear
									</Button>

									<input type="hidden" name="cover" value={cover ?? ""} />
									<AlbumArtwork
										hasContextMenu={false}
										aspectRatio="portrait"
										className="w-[150px]"
										width={150}
										height={150}
										album={{
											title: "",
											cover: cover,
											artist: "",
										}}
									/>
								</>
							)}
						</div>

						<FormControl name="file" label="Pages" errors={actionData?.errors}>
							<Input
								type="file"
								multiple={true}
								onClick={() => {
									setFiles([])
								}}
								onChange={processPages}
							/>
						</FormControl>

						<div className="flex flex-row space-x-4 ">
							{loadingPages && <p>Processing {loadingPages} files</p>}
							{files.length > 0 && (
								<Button type="button" onClick={() => setFiles([])}>
									Clear
								</Button>
							)}

							<div className="grid grid-cols-6 gap-4">
								{files.map((file, idx) => (
									<div key={file.page}>
										<AlbumArtwork
											hasContextMenu={false}
											key={file.page}
											aspectRatio="portrait"
											className="w-[150px]"
											width={150}
											height={150}
											album={{
												title: file.page.toString(),
												cover: file.url,
												artist: "",
											}}
										/>
										<div>
											<p>{file.page}</p>
										</div>
										<input
											value={file.url}
											type="hidden"
											name={`file[${idx}][url]`}
										/>
										<input
											value={file.page}
											type="hidden"
											name={`file[${idx}][page]`}
										/>
									</div>
								))}
							</div>
						</div>

						<Button disabled={!!loadingPages || isSubmitting} type="submit">
							Submit
						</Button>
					</Form>
				</CardContent>
			</Card>
		</Page>
	)
}
