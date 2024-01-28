import { ActionFunctionArgs } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { Dispatch, SetStateAction, useState } from "react"
import { z } from "zod"
import { useObjectUrls } from "~/hooks/useOjectUrls"
import { supabase, superSupabase } from "~/infra/supabase"
import { makeForm } from "~/lib/makeForm"
import { AlbumArtwork } from "../_index/components/album"
import { transformFileToWebp } from "~/lib/transformFileToWebp"
import { b64toBlob } from "~/lib/b64toBlob"

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
	const [file, setFile] = useState<string>("")

	const getObjectUrl = useObjectUrls()

	return (
		<div className="flex flex-col gap-4">
			<Form method="post" replace>
				<h1>Profile</h1>
				<p>Profile page content</p>
				<input
					type="file"
					accept="image/*"
					onChange={(event) => {
						if (event.target.files?.length) {
							transformFileToWebp(event.target.files[0], getObjectUrl, setFile)
						}
					}}
				/>

				<input value={file} type="hidden" name="profile" />

				<AlbumArtwork
					hasContextMenu={false}
					className="w-[250px]"
					aspectRatio="portrait"
					album={{
						title: "test",
						artist: "test",
						cover: file,
					}}
				/>

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
