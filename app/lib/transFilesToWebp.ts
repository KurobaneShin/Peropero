export const transformFilesToWebp = async (
	file: File,
	getObjectUrl: (file: File) => string,
	page: number,
): Promise<{
	url: string
	page: number
}> => {
	return new Promise((resolve) => {
		const image = new Image()
		image.src = getObjectUrl(file)
		image.onload = () => {
			const canvas = document.createElement("canvas")
			const ctx = canvas.getContext("2d")

			canvas.width = image.width
			canvas.height = image.height

			ctx?.drawImage(image, 0, 0)

			const url = canvas.toDataURL("image/webp", 0.1)

			resolve({
				url,
				page,
			})
		}
	})
}
