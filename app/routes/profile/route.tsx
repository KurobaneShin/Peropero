import { ActionFunctionArgs, redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { useState } from "react"
import { z } from "zod"
import { accessToken } from "~/cookies"
import { useObjectUrls } from "~/hooks/useOjectUrls"
import { supabase, superSupabase } from "~/infra/supabase"
import { b64toBlob } from "~/lib/b64toBlob"
import { getUser } from "~/lib/getUser"
import { makeForm } from "~/lib/makeForm"
import { transformFileToWebp } from "~/lib/transformFileToWebp"
import { AlbumArtwork } from "../_index/components/album"

const { parse } = makeForm(
	z.object({
		profile: z.string(),
	}),
)

export const action = async (args: ActionFunctionArgs) => {
	const user = await getUser(args.request)
	const data = parse(await args.request.formData())

	if (data.errors) {
		console.log(data.errors)
		return {}
	}

	const blob = await b64toBlob(data.data.profile, "image/webp")

	const { error, data: image } = await superSupabase.storage
		.from("avatars")
		.upload(user, blob, {
			upsert: true,
		})

	if (error) {
		console.log(error)
	}

	const { data: profile } = await supabase
		.from("profiles")
		.update({
			avatar: `${process.env.SUPABASE_URL}/storage/v1/object/public/avatars/${image?.path}`,
		})
		.eq("id", user)
		.select("*")
		.maybeSingle()

	const session = await accessToken.getSession(
		args.request.headers.get("cookie"),
	)

	session.set("profile", profile)

	return redirect("/", {
		headers: {
			"Set-Cookie": await accessToken.commitSession(session),
		},
	})
}

export default function ProfileRoute() {
	const [file, setFile] = useState<string>("")

	const getObjectUrl = useObjectUrls()

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
							transformFileToWebp(event.target.files[0], getObjectUrl, setFile)
						}
					}}
				/>

				<input value={file} type="hidden" name="profile" />
				{file && (
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
				)}
				<button type="submit">Submit</button>
			</Form>
		</div>
	)
}
