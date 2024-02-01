import { Dispatch, SetStateAction } from "react"

export const transformFilesToWebp = (
	file: File,
	page: number,
	getObjectUrl: (file: File) => string,
	setFile: Dispatch<
		SetStateAction<
			{
				url: string
				page: number
			}[]
		>
	>,
) => {
	const image = new Image()
	image.src = getObjectUrl(file)
	image.onload = () => {
		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")

		canvas.width = image.width
		canvas.height = image.height

		ctx?.drawImage(image, 0, 0)

		const url = canvas.toDataURL("image/webp", 0.1)

		setFile((prev) => [
			...prev,
			{
				url,
				page,
			},
		])
	}
}
