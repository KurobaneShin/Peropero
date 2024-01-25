import { LoaderFunctionArgs } from "@remix-run/node"
import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useNavigation,
} from "@remix-run/react"
import clsx from "clsx"
import nProgress from "nprogress"
import { useEffect } from "react"
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes"
import { themeSessionResolver } from "./cookies"
import "./globals.css"
import { Sidebar } from "./routes/_index/components/sidebar"
import { Button } from "./components/ui/button"
import { ModeToggle } from "./components/custom/modeToggle"
import { DrawerSidebar } from "./components/custom/drawerSidebar"

export async function loader({ request }: LoaderFunctionArgs) {
	const { getTheme } = await themeSessionResolver(request)
	return {
		theme: getTheme(),
	}
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
						<div>Hentai</div>
					</Link>
					<div className="lg:hidden mb-[-0.3rem]">
						<DrawerSidebar />
					</div>
					<div className="ml-auto flex items-center space-x-4">
						<ModeToggle />
						<Link to="/signin" prefetch="intent">
							<Button>Sign in</Button>
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-4 lg:grid-cols-5">
					<Sidebar playlists={[]} className="hidden lg:block border-r" />
					<div className="col-span-4">
						<Outlet />
					</div>
				</div>

				<ScrollRestoration />
				<LiveReload />
				<Scripts />
			</body>
		</html>
	)
}
