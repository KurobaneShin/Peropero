export const b64toBlob = async (
	b64Data: string,
	contentType = "",
	sliceSize = 512,
): Promise<Blob> => {
	return new Promise((resolve) => {
		const b64Clean = b64Data.replace(
			/^data:image\/(png|jpg|jpeg|webp);base64,/,
			"",
		)
		const byteCharacters = atob(b64Clean)
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

		resolve(blob)
	})
}
