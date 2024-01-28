import { ActionFunctionArgs } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { z } from "zod"
import { useObjectUrls } from "~/hooks/useOjectUrls"
import { supabase, superSupabase } from "~/infra/supabase"
import { makeForm } from "~/lib/makeForm"
import { AlbumArtwork } from "../_index/components/album"

const { parse } = makeForm(
	z.object({
		profile: z.string(),
	}),
)
export const action = async (args: ActionFunctionArgs) => {
	const data = parse(await args.request.formData())

	if (data.errors) {
		console.log(data.errors)
		return {}
	}

	const b64toBlob = (b64Data: string, contentType = "", sliceSize = 512) => {
		b64Data = b64Data.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "")
		const byteCharacters = atob(b64Data)
		const byteArrays = []

		for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			const slice = byteCharacters.slice(offset, offset + sliceSize)

			const byteNumbers = new Array(slice.length)
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i)
			}

			const byteArray = new Uint8Array(byteNumbers)
			byteArrays.push(byteArray)
		}

		const blob = new Blob(byteArrays, { type: contentType })
		return blob
	}

	const blob = b64toBlob(data.data.profile, "image/webp")

	const { error } = await superSupabase.storage
		.from("profiles")
		.upload("test", blob, {
			upsert: true,
		})

	if (error) {
		console.log(error)
	}

	return {}
}

export default function ProfileRoute() {
	const [file, setFile] = useState("")

	const getObjectUrl = useObjectUrls()

	const transformFileToWebp = (file: File) => {
		const image = new Image()
		image.src = getObjectUrl(file)
		image.onload = () => {
			const canvas = document.createElement("canvas")
			const ctx = canvas.getContext("2d")

			canvas.width = image.width
			canvas.height = image.height

			ctx?.drawImage(image, 0, 0)

			let test = canvas.toDataURL("image/webp", 0.1)

			setFile(test)
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<Form method="post">
				<h1>Profile</h1>
				<p>Profile page content</p>
				<input
					type="file"
					accept="image/*"
					onChange={(event) => {
						if (event.target.files?.length) {
							transformFileToWebp(event.target.files[0])
						}
					}}
				/>

				<input type="hidden" name="profile" value={file} />
				<button type="submit">Submit</button>
			</Form>

			<AlbumArtwork
				contextMenu="false"
				className="w-[250px]"
				aspectRatio="portrait"
				album={{
					title: "test",
					artist: "test",
					cover:
						"http://127.0.0.1:54321/storage/v1/object/public/profiles/test",
				}}
			/>
		</div>
	)
}
