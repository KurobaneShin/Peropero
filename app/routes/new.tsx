import {
	Form,
	Link,
	Outlet,
	useLoaderData,
	useLocation,
} from "@remix-run/react"
import { useState } from "react"
import { ComboboxDemo } from "~/components/custom/combobox"
import { InputWithLabel } from "~/components/custom/inputWithLabel"
import { Input } from "~/components/ui/input"
import { AlbumArtwork } from "./_index/components/album"
import { Combobox } from "~/components/custom/multipleCombobox"
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { supabase, superSupabase } from "~/infra/supabase"
import { Label } from "@radix-ui/react-label"
import { Button } from "~/components/ui/button"
import { makeForm } from "~/lib/makeForm"
import { z } from "zod"
import { zfd } from "zod-form-data"

const { parse } = makeForm(
	z.object({
		title: zfd.text(),
		authors: z.array(z.string()).or(z.string()),
		tags: z.array(z.string()).or(z.string()),
		file: z.array(z.instanceof(Blob)),
	}),
)

export const loader = async (args: LoaderFunctionArgs) => {
	const authorsPromise = supabase.from("authors").select("*")
	const tagsPromise = supabase.from("tags").select("*")

	const [authors, tags] = await Promise.all([authorsPromise, tagsPromise])

	const formattedAuthors =
		authors.data?.map((author) => ({
			value: author.id.toString(),
			label: author.name,
		})) || []

	const formattedTags =
		tags.data?.map((tag) => ({
			value: tag.id.toString(),
			label: tag.title,
		})) || []

	return { authors: formattedAuthors, tags: formattedTags }
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
	try {
		const { data, errors } = parse(await request.formData())
		console.log(data)

		if (errors) {
			console.log(errors)
			return { errors }
		}

		const testFormData = await request.clone().formData()
		console.log("em cima", testFormData.getAll("file"))
		const files = testFormData.getAll("file")

		const uploadPromises = files.map(async (file) => {
			return superSupabase.storage
				.from("pages")
				.upload(`pages-${Math.random().toString(36).substring(7)}.jpg`, file)
				.then((res) => {
					return res.data?.path
				})
		})
		const uploadResults = await Promise.all(uploadPromises)
		console.log(uploadResults)

		return null
	} catch (e) {
		console.log(e)
		return e
	}
}

export default function New() {
	const { authors, tags } = useLoaderData<typeof loader>()
	const { pathname } = useLocation()

	const [files, setFiles] = useState<File[]>([])
	const [artists, setArtists] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	return (
		<Form method="post" action={pathname} encType="multipart/form-data">
			<InputWithLabel label="Titulo" name="title" />

			<Label>Authors</Label>
			<Combobox
				options={authors}
				clearable
				value={artists}
				multiple
				onValueChange={(v) => {
					setArtists(v)
				}}
			/>

			{artists.map((artist) => (
				<input key={artist} type="hidden" name="artists" value={artist} />
			))}

			<p className="text-sm text-muted-foreground">
				Arthist no found? <Link to="/authors/new">click here!</Link> to add
			</p>
			<Label>Tags</Label>
			<Combobox
				options={tags}
				clearable
				value={selectedTags}
				multiple
				onValueChange={(v) => {
					setSelectedTags(v)
				}}
			/>

			{selectedTags.map((tag) => (
				<input key={tag} type="hidden" name="tags" value={tag} />
			))}

			<p className="text-sm text-muted-foreground">
				Tag no found? <Link to="/tags/new">click here!</Link> to add
			</p>

			<Input
				type="file"
				name="file"
				multiple
				onChange={(e) => {
					console.log(e.target.files)
					const files = Array.from(e.target.files || [])
					setFiles(files)
				}}
			/>

			<div className="flex flex-row space-x-4">
				{files.map((file: File) => (
					<AlbumArtwork
						key={file.name}
						aspectRatio="portrait"
						className="w-[150px]"
						width={150}
						height={150}
						album={{
							title: file.name,
							cover: URL.createObjectURL(file),
							artist: "",
						}}
					/>
				))}
			</div>
			<Button type="submit">Submit</Button>
		</Form>
	)
}
