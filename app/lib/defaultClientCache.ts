import {
	ClientActionFunctionArgs,
	ClientLoaderFunctionArgs,
} from "@remix-run/react"
import { cache } from "./sessionStorage"

export const defaultClientCache = async (
	cacheKey: string,
	args: ClientLoaderFunctionArgs,
) => {
	const cacheData = cache.get(cacheKey)

	if (cacheData) {
		return cacheData
	}

	const loaderData = await args.serverLoader()

	return cache.setAsync(cacheKey, loaderData as Record<string, unknown>)
}

export const defaultClientAction = async (args: ClientActionFunctionArgs) => {
	cache.clear()
	const data = await args.serverAction()
	return data
}
