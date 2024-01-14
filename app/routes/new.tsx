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
import { LoaderFunctionArgs } from "@remix-run/node"
import { supabase } from "~/infra/supabase"
import { Label } from "@radix-ui/react-label"

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

export default function New() {
	const { authors, tags } = useLoaderData<typeof loader>()
	const { pathname } = useLocation()

	const [files, setFiles] = useState<File[]>([])
	const [artists, setArtists] = useState<string[]>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	return (
		<Form method="post" action={pathname}>
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
		</Form>
	)
}
