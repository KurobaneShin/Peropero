import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useNavigation,
} from "@remix-run/react"
import "./globals.css"
import clsx from "clsx"
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes"
import { themeSessionResolver } from "./cookies"
import { LoaderFunctionArgs } from "@remix-run/node"
import { Sidebar } from "./routes/_index/components/sidebar"
import { useEffect } from "react"
import nProgress from "nprogress"

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
				<div className="grid grid-cols-5">
					<Sidebar playlists={[]} className="hidden lg:block" />
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
