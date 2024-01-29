import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type UserAvatarProps = {
	userName: string
	avatar?: string
}

export function UserAvatar({ userName, avatar }: UserAvatarProps) {
	return (
		<Avatar>
			<AvatarImage src={avatar} alt="avatar" />
			<AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
		</Avatar>
	)
}
