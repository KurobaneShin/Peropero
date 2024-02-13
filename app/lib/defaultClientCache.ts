import { ClientLoaderFunctionArgs } from "@remix-run/react"
import { cache } from "./sessionStorage"

export const defaultClientCache = async <T>(
	cacheKey: string,
	args: ClientLoaderFunctionArgs,
) => {
	const cacheData = cache.get(cacheKey)

	if (cacheData) return cacheData

	const loaderData = await args.serverLoader<T>()

	return cache.setAsync<T>(cacheKey, loaderData)
}
