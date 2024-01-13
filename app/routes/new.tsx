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
const frameworks = [
	{
		value: "next.js",
		label: "Next.js",
	},
	{
		value: "sveltekit",
		label: "SvelteKit",
	},
	{
		value: "nuxt.js",
		label: "Nuxt.js",
	},
	{
		value: "remix",
		label: "Remix",
	},
	{
		value: "astro",
		label: "Astro",
	},
]

export const loader = async (args: LoaderFunctionArgs) => {
	const authors = await supabase.from("authors").select("*")

	const formattedAuthors =
		authors.data?.map((author) => ({
			value: author.id.toString(),
			label: author.name,
		})) || []

	const newFrameworks = [...frameworks, { value: "laravel", label: "Laravel" }]
	return { frameworks: newFrameworks, authors: formattedAuthors }
}

export default function New() {
	const { frameworks, authors } = useLoaderData<typeof loader>()
	const { pathname } = useLocation()

	const [files, setFiles] = useState<File[]>([])
	const [artists, setArtists] = useState<string[]>([])
	return (
		<Form method="post" action={pathname}>
			<InputWithLabel label="Titulo" name="title" />
			<ComboboxDemo label="Categoria" name="category" items={frameworks} />

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
				Nao encontrou o artista? <Link to="/authors/new">Clique aqui</Link> para
				adicionar
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
