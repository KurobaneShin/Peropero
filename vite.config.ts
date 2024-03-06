import { vitePlugin as remix } from "@remix-run/dev"
import { vercelPreset } from "@vercel/remix/vite"
import morgan from "morgan"
import { type ViteDevServer, defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

function morganPlugin() {
	return {
		name: "morgan-plugin",
		configureServer(server: ViteDevServer) {
			return () => {
				server.middlewares.use(morgan("dev"))
			}
		},
	}
}

export default defineConfig({
	build: {
		cssMinify: process.env.NODE_ENV === "production",
	},
	plugins: [
		remix({
			presets: [vercelPreset()],
		}),
		tsconfigPaths(),
		morganPlugin(),
	],
})
