import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type UserAvatarProps = {
	userName: string
}

export function UserAvatar({ userName }: UserAvatarProps) {
	return (
		<Avatar>
			<AvatarImage
				src="https://github.com/kurobaneshin.png"
				alt="@kurobaneshin"
			/>
			<AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
		</Avatar>
	)
}
