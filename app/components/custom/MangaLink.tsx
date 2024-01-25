import { Link } from "@remix-run/react"
import { useEffect, useState } from "react"

export function MangaLink({
	id,
	children,
	pages,
	cover,
}: {
	id: string
	cover: string
	title: string
	children?: React.ReactNode
	pages?: {
		id: string
		image: string
	}[]
}) {
	const [prefetch, setPrefetch] = useState("intent")

	// Don't prefetch cached mangas
	useEffect(() => {
		if (sessionStorage.getItem(`/mangas/${id}`)) {
			setPrefetch("none")
		}
	})

	const prefetchImage = () => {
		if (prefetch === "none") return

		if (cover) {
			const img = new Image()
			img.src = cover
		}

		if (pages) {
			for (const page of pages) {
				const img = new Image()
				img.src = page.image
			}
		}
	}

	return (
		<Link
			to={`/mangas/${id}`}
			prefetch={prefetch as any}
			onMouseEnter={prefetchImage}
			onFocus={prefetchImage}>
			{children}
		</Link>
	)
}
