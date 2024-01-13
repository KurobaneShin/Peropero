import { unstable_vitePlugin as remix } from "@remix-run/dev"
import { defineConfig, type ViteDevServer } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import morgan from "morgan"

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
	plugins: [remix(), tsconfigPaths(), morganPlugin()],
})
