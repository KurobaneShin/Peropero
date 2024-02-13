import { Link } from "@remix-run/react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

type UserAvatarProps = {
	userName: string
	avatar?: string
}

export function UserAvatar({ userName, avatar }: UserAvatarProps) {
	return (
		<Popover>
			<PopoverTrigger>
				<Avatar>
					<AvatarImage src={avatar} alt="avatar" />
					<AvatarFallback>
						{userName.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</PopoverTrigger>
			<PopoverContent className="flex flex-col justify-start w-max">
				<Link className="w-max" prefetch="intent" to="/profile">
					<Button variant="ghost">Profile</Button>
				</Link>
				<Link to="/logout">
					<Button variant="ghost">Log out</Button>
				</Link>
			</PopoverContent>
		</Popover>
	)
}
