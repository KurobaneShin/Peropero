import { Menu } from "lucide-react"
import { Sidebar } from "~/routes/_index/components/sidebar"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "../ui/drawer"
import { ScrollArea } from "../ui/scroll-area"

export function DrawerSidebar() {
	return (
		<Drawer>
			<DrawerTrigger>
				<Menu className="w-6 h-6 text-primary-foreground" />
			</DrawerTrigger>
			<DrawerContent>
				<ScrollArea>
					<Sidebar className="max-h-[40rem]" playlists={[]} />
				</ScrollArea>
				<DrawerFooter>
					<DrawerClose className=" p-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
						<span>Close</span>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	)
}
