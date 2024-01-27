import { Link } from "@remix-run/react"
import React, { useEffect, useState } from "react"

type PageLinkProps = {
	to: string
	className?: string
	children?: React.ReactNode
	page: number
	mangaId: string
	image: string
	prefetch?: "render" | "intent" | "none"
}

export function PageLink({
	to,
	className,
	children,
	page,
	mangaId,
	image,
}: PageLinkProps) {
	const [prefetch, setPrefetch] = useState("intent")

	// Don't prefetch cached mangas
	useEffect(() => {
		if (sessionStorage.getItem(`/mangas/${mangaId}/${page}`)) {
			setPrefetch("none")
		}
	})

	const prefetchImage = () => {
		if (prefetch === "none") return

		if (image) {
			const img = new Image()
			img.src = image
		}
	}

	return (
		<Link
			to={to}
			aria-label={`Page ${page}`}
			prefetch={prefetch as "render" | "intent" | "none"}
			onMouseEnter={prefetchImage}
			onFocus={prefetchImage}
			className={className}>
			{children}
		</Link>
	)
}
