import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useNavigation,
} from "@remix-run/react"
import {
	HeadersFunction,
	LinksFunction,
	LoaderFunctionArgs,
	json,
} from "@vercel/remix"
import clsx from "clsx"
import nProgress from "nprogress"
import { useEffect } from "react"
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes"
import { UserAvatar } from "./components/custom/UserAvatar"
import { DrawerSidebar } from "./components/custom/drawerSidebar"
import { ModeToggle } from "./components/custom/modeToggle"
import { Button } from "./components/ui/button"
import { accessToken, themeSessionResolver } from "./cookies"
import tailwindStyleSheetUrl from "./globals.css?url"
import { makeTimings } from "./lib/timing.server"
import { combineHeaders } from "./lib/utils"
import { Sidebar } from "./routes/_index/components/sidebar"

export const links: LinksFunction = () => {
	return [
		{ rel: "preload", href: tailwindStyleSheetUrl, as: "style" },
		{ rel: "stylesheet", href: tailwindStyleSheetUrl },
		{
			rel: "manifest",
			href: "/site.webmanifest",
			crossOrigin: "use-credentials",
		} as const,
	].filter(Boolean)
}

export async function loader({ request }: LoaderFunctionArgs) {
	const { getTheme } = await themeSessionResolver(request)
	const timings = makeTimings("root loader")

	const session = await accessToken.getSession(request.headers.get("Cookie"))
	const user = session.get("profile")

	return json(
		{
			theme: getTheme(),
			user,
		},
		{
			headers: combineHeaders({
				"Server-Timing": timings.toString(),
			}),
		},
	)
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	const headers = {
		"Server-Timing": loaderHeaders.get("Server-Timing") ?? "",
	}
	return headers
}

export default function AppWithProviders() {
	const data = useLoaderData<typeof loader>()
	return (
		<ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
			<App />
		</ThemeProvider>
	)
}
function App() {
	const data = useLoaderData<typeof loader>()
	const transition = useNavigation()

	// nprogress
	useEffect(() => {
		if (transition.state === "loading" || transition.state === "submitting") {
			nProgress.start()
		}
		if (transition.state === "idle") {
			nProgress.done()
		}
	}, [transition.state])

	const [theme] = useTheme()
	return (
		<html lang="en" className={clsx(theme)}>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
				<Links />
			</head>

			<body>
				<div className="flex h-16 items-center justify-center gap-2 px-4 border-b">
					<Link to="/">
						<div>Peropero</div>
					</Link>
					<div className="lg:hidden mb-[-0.3rem]">
						<DrawerSidebar />
					</div>
					<div className="ml-auto flex items-center space-x-4">
						<ModeToggle />
						{data.user ? (
							<UserAvatar
								userName={data.user.username}
								avatar={data.user.avatar}
							/>
						) : (
							<Link to="/signin" prefetch="intent">
								<Button>Sign in</Button>
							</Link>
						)}
					</div>
				</div>

				<div className="grid grid-cols-4 lg:grid-cols-5">
					<Sidebar playlists={[]} className="hidden lg:block border-r" />
					<div className="col-span-4">
						<Outlet />
					</div>
				</div>

				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}
