import {
	ContextMenuContent,
	ContextMenuTrigger,
} from "@radix-ui/react-context-menu"
import {
	ContextMenu,
	ContextMenuItem,
	ContextMenuSeparator,
} from "~/components/ui/context-menu"
import { Manga, mangas } from "../data/mangas"
import { cn } from "~/lib/utils"
import { Link } from "@remix-run/react"

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
	album: Manga
	aspectRatio?: "portrait" | "square"
	width?: number
	height?: number
	hasContextMenu?: boolean
}

export function AlbumArtwork({
	album,
	aspectRatio = "portrait",
	width,
	height,
	className,
	hasContextMenu = true,
	...props
}: AlbumArtworkProps) {
	if (!hasContextMenu) {
		return (
			<div className={cn("space-y-3", className)} {...props}>
				<div className="overflow-hidden rounded-md">
					<img
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
						<Link to={`/mangas/${album.id}`} prefetch="intent">
							<img
								src={album.cover}
								alt={album.title}
								width={width}
								height={height}
								className={cn(
									"h-auto w-auto object-cover transition-all hover:scale-105",
									aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
								)}
							/>
						</Link>
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
				<h3 className="font-medium leading-none">{album.title}</h3>
				<p className="text-xs text-muted-foreground">{album.artist}</p>
			</div>
		</div>
	)
}
