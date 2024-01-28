import {
	ActionFunctionArgs,
	defer,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/node"
import {
	Await,
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
	Form,
	Link,
	useLoaderData,
	useLocation,
} from "@remix-run/react"
import { Suspense, useEffect, useState } from "react"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { InputWithLabel } from "~/components/custom/inputWithLabel"
import { Combobox } from "~/components/custom/multipleCombobox"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useObjectUrls } from "~/hooks/useOjectUrls"
import { supabase } from "~/infra/supabase"
import { makeForm } from "~/lib/makeForm"
import { AlbumArtwork } from "./_index/components/album"
import { getUser } from "~/lib/getUser"
import { Label } from "~/components/ui/label"
import { transformFileToWebp } from "~/lib/transformFileToWebp"
import { b64toBlob } from "~/lib/b64toBlob"

const { parse } = makeForm(
	z.object({
		title: zfd.text(),
		authors: z.array(z.string()).or(z.string()),
		tags: z.array(z.string()).or(z.string()),
		file: z.array(z.string()),
		cover: z.string(),
	}),
)

export const loader = async (args: LoaderFunctionArgs) => {
	await getUser(args.request)
	const authorsPromise = async () => {
		const data = await supabase.from("authors").select("*")

		return (
			data.data?.map((author) => ({
				value: author.id.toString(),
				label: author.name,
			})) || []
		)
	}
	const tagsPromise = async () => {
		const data = await supabase.from("tags").select("*")

		return (
			data.data?.map((tag) => ({
				value: tag.id.toString(),
				label: tag.title,
			})) || []
		)
	}

	return defer({ authors: authorsPromise(), tags: tagsPromise() })
}

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
	const cacheKey = "/new"
	const cache = sessionStorage.getItem(cacheKey)

	if (cache) return JSON.parse(cache)

	const loaderData = await serverLoader<typeof loader>()

	const tags = await loaderData.tags
	const authors = await loaderData.authors

	sessionStorage.setItem(cacheKey, JSON.stringify({ tags, authors }))
	return { tags, authors }
}

clientLoader.hydrate = true

function handlePageUploads(files: Blob[]) {
	return files.map(async (file) =>
		supabase.storage
			.from("pages")
			.upload(`pages-${Math.random().toString(36).substring(7)}.jpg`, file)
			.then((res) => {
				return res.data?.path
			})
			.catch((e) => console.log(e)),
	)
}

async function handleCoverUpload(file: Blob) {
	return supabase.storage
		.from("covers")
		.upload(`covers-${Math.random().toString(36).substring(7)}.jpg`, file)
		.then((res) => res.data?.path)
}

export const action = async ({ request }: ActionFunctionArgs) => {
	try {
		const { data, errors } = parse(await request.formData())
		if (errors) {
			return { errors }
		}

		const filesBlobs = data.file.map((file) => b64toBlob(file, "image/webp"))

		const uploadPromises = handlePageUploads(filesBlobs)

		const coverBlob = b64toBlob(data.cover, "image/webp")
		const coverUpload = await handleCoverUpload(coverBlob)

		const uploadResults = await Promise.all(uploadPromises)

		const { data: newManga, error: mangaError } = await supabase
			.from("mangas")
			.insert({
				title: data.title,
				cover: `${process.env.SUPABASE_URL}/storage/v1/object/public/covers/${coverUpload}`,
			})
			.select()

		if (mangaError) {
			return { errors: mangaError }
		}

		const pagesInsert = uploadResults.map((page, idx) =>
			supabase.from("pages").insert({
				page: idx + 1,
				manga: newManga?.[0]?.id,
				image: `${process.env.SUPABASE_URL}/storage/v1/object/public/pages/${page}`,
			}),
		)

		const authorsToInsert = Array.isArray(data.authors)
			? data.authors
			: [data.authors]

		const tagsToInsert = Array.isArray(data.tags) ? data.tags : [data.tags]

		const authorsInsert = authorsToInsert.map((author) => ({
			manga: newManga?.[0]?.id as number,
			author: Number(author),
		}))

		const tagsInsert = tagsToInsert.map((tag) => ({
			manga: newManga?.[0]?.id,
			tag: Number(tag),
		}))

		const authorsInsertPromise = authorsInsert.map((author) =>
			supabase.from("mangas_authors").insert(author),
		)
		const tagsInsertPromise = tagsInsert.map((tag) =>
			supabase.from("mangas_tags").insert(tag),
		)

		await Promise.all([
			...authorsInsertPromise,
			...tagsInsertPromise,
			...pagesInsert,
		])

		return redirect(`/mangas/${newManga?.[0]?.id}`)
	} catch (e) {
		return e
	}
}

export const clientAction = async ({
	serverAction,
}: ClientActionFunctionArgs) => {
	sessionStorage.removeItem("/root")
	const data = await serverAction()
	return data
}

export default function New() {
	const { authors, tags } = useLoaderData<typeof loader>()
	const { pathname } = useLocation()

	const [files, setFiles] = useState<string[]>([])

	const [cover, setCover] = useState<string[]>([])
	const [artists, setArtists] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	const [loadingPages, setLoadingPages] = useState<number>()
	const getObjectUrl = useObjectUrls()

	useEffect(() => {
		if (files.length === loadingPages) setLoadingPages(undefined)
	}, [files])

	return (
		<Form method="post" action={pathname} encType="multipart/form-data">
			<InputWithLabel label="Titulo" name="title" />

			<Label>Authors</Label>

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

			{artists.map((artist) => (
				<input key={artist} type="hidden" name="authors" value={artist} />
			))}

			<p className="text-sm text-muted-foreground">
				Arthist no found? <Link to="/authors/new">click here!</Link> to add
			</p>
			<Label>Tags</Label>

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

			<Label>Cover</Label>
			<Input
				type="file"
				onChange={(e) => {
					if (e.target.files?.length) {
						transformFileToWebp(
							Array.from(e.target.files),
							getObjectUrl,
							setCover,
						)
					}
				}}
			/>

			<Button type="button" onClick={() => setCover([])}>
				Clear
			</Button>

			<input type="hidden" name="cover" value={cover[0] ?? ""} />

			{cover.length > 0 && (
				<AlbumArtwork
					hasContextMenu={false}
					aspectRatio="portrait"
					className="w-[150px]"
					width={150}
					height={150}
					album={{
						title: "",
						cover: cover[0],
						artist: "",
					}}
				/>
			)}

			<Label>Pages</Label>
			<Input
				type="file"
				multiple={true}
				onChange={(e) => {
					if (e.target.files?.length) {
						setLoadingPages(e.target.files.length)
						transformFileToWebp(
							Array.from(e.target.files),
							getObjectUrl,
							setFiles,
						)
					}
				}}
			/>

			<div className="flex flex-row space-x-4 flex-wrap">
				{loadingPages && <p>Processing {loadingPages} files</p>}
				{files.map((file: string, idx) => (
					<div key={idx}>
						<AlbumArtwork
							hasContextMenu={false}
							key={idx}
							aspectRatio="portrait"
							className="w-[150px]"
							width={150}
							height={150}
							album={{
								title: "",
								cover: file,
								artist: "",
							}}
						/>
						<input value={file} type="hidden" name="file" />
					</div>
				))}
			</div>

			<Button type="button" onClick={() => setCover([])}>
				Clear
			</Button>

			<Button disabled={!!loadingPages} type="submit">
				Submit
			</Button>
		</Form>
	)
}
