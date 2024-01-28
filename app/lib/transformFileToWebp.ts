import { Dispatch, SetStateAction } from "react"

export const transformFileToWebp = (
	file: File,
	getObjectUrl: (file: File) => string,
	setFile: Dispatch<SetStateAction<string>>,
) => {
	const image = new Image()
	image.src = getObjectUrl(file)
	image.onload = (e) => {
		const canvas = document.createElement("canvas")
		const ctx = canvas.getContext("2d")

		canvas.width = image.width
		canvas.height = image.height

		ctx?.drawImage(image, 0, 0)

		const url = canvas.toDataURL("image/webp", 0.8)

		setFile(url)
	}
}
