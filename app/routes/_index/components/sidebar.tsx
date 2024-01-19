import { Link, useLocation, useNavigate } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { cn } from "~/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
	playlists: any[]
}

const routes = [
	{
		name: "Home",
		path: "/",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-4 w-4 mr-2"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<title>Home</title>
				<path
					fillRule="evenodd"
					d="M10.707 3.293a1 1 0 0 1 1.414 0l6 6a1 1 0 1 1-1.414 
          1.414L11 5.414V17a1 1 0 1 1-2 0V5.414L4.707 
          10.707a1 1 0 1 1-1.414-1.414l6-6z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		name: "Random",
		path: "/random",
	},
	{
		name: "Tags",
		path: "/tags",
	},
	{
		name: "Authors",
		path: "/authors",
	},
	{
		name: "Groups",
		path: "/groups",
	},
	{
		name: "Parodies",
		path: "/parodies",
	},
	{
		name: "Characters",
		path: "/characters",
	},
	{
		name: "Languages",
		path: "/languages",
	},
]

export function Sidebar({ className, playlists }: SidebarProps) {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	return (
		<div className={cn("pb-12", className)}>
			<div className="space-y-4 py-4">
				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
						Discover
					</h2>
					<div className="space-y-1">
						{routes.slice(0, 2).map((route, i) => (
							<Link
								to={route.path}
								prefetch="intent"
								key={`${route.name}-${i}`}
							>
								<Button
									variant={pathname === route.path ? "secondary" : "ghost"}
									onClick={() => navigate(route.path)}
									className={cn("w-full justify-start")}
								>
									{route.icon}
									{route.name}
								</Button>
							</Link>
						))}
					</div>
				</div>
				<div className="px-3 py-2">
					<h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
						Mangas
					</h2>
					<div className="space-y-1">
						{routes.slice(2).map((route, i) => (
							<Link
								to={route.path}
								prefetch="intent"
								key={`${route.name}-${i}`}
							>
								<Button
									variant={pathname === route.path ? "secondary" : "ghost"}
									onClick={() => navigate(route.path)}
									className={cn("w-full justify-start")}
								>
									{route.icon}
									{route.name}
								</Button>
							</Link>
						))}
					</div>
				</div>
				<div className="py-2">
					<h2 className="relative px-7 text-lg font-semibold tracking-tight">
						Favorites
					</h2>
					<ScrollArea className="h-[300px] px-1">
						<div className="space-y-1 p-2">
							{playlists?.map((playlist, i) => (
								<Button
									key={`${playlist}-${i}`}
									variant="ghost"
									className="w-full justify-start font-normal"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="mr-2 h-4 w-4"
									>
										<path d="M21 15V6" />
										<path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
										<path d="M12 12H3" />
										<path d="M16 6H3" />
										<path d="M12 18H3" />
									</svg>
									{playlist}
								</Button>
							))}
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	)
}
