import {
	ContextMenuContent,
	ContextMenuTrigger,
} from "@radix-ui/react-context-menu"
import { Link } from "@remix-run/react"
import { MangaLink } from "~/components/custom/MangaLink"
import {
	ContextMenu,
	ContextMenuItem,
	ContextMenuSeparator,
} from "~/components/ui/context-menu"
import { cn } from "~/lib/utils"
import { Manga } from "../data/mangas"

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
	album: Manga
	aspectRatio?: "portrait" | "square"
	width?: number
	height?: number
	hasContextMenu?: boolean
	pages?: {
		id: string
		image: string
	}[]
}

export function AlbumArtwork({
	album,
	aspectRatio = "portrait",
	width,
	height,
	className,
	hasContextMenu = true,
	pages,
	...props
}: AlbumArtworkProps) {
	if (!hasContextMenu) {
		return (
			<div className={cn("space-y-3", className)} {...props}>
				<div className="overflow-hidden rounded-md">
					<img
						loading="lazy"
						src={album.cover}
						alt={album.title}
						width={width}
						height={height}
						className={cn(
							"h-auto w-auto object-cover transition-all hover:scale-105",
							aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
						)}
					/>
				</div>
			</div>
		)
	}

	return (
		<div className={cn("space-y-3", className)} {...props}>
			<ContextMenu>
				<ContextMenuTrigger>
					<div className="overflow-hidden rounded-md">
						<MangaLink
							id={album.id?.toString() as string}
							title={album.title}
							cover={album.cover}
							pages={pages}>
							<img
								loading="lazy"
								decoding="async"
								src={album.cover}
								alt={album.title}
								width={width}
								height={height}
								className={cn(
									"h-auto w-auto object-cover transition-all hover:scale-105",
									aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
								)}
							/>
						</MangaLink>
					</div>
				</ContextMenuTrigger>
				<ContextMenuContent className="w-40 bg-background">
					<ContextMenuItem>
						<Link to={`/mangas/${album.id}`}>View Album</Link>
					</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem>Bookmark</ContextMenuItem>

					<ContextMenuItem>favorite</ContextMenuItem>
					<ContextMenuItem>Share</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			<div className="space-y-1 text-sm">
				<h3 className="font-medium leading-none truncate">{album.title}</h3>
				<p className="text-xs text-muted-foreground truncate">{album.artist}</p>
			</div>
		</div>
	)
}
