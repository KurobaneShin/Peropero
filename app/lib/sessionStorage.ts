export type SessionStorage = {
	get: (key: string) => unknown
	set: (key: string, value: unknown) => void
	remove: (key: string) => void
	clear: () => void
	setAsync: <T>(
		cacheKey: string,
		asyncData: Record<string, unknown>,
	) => Promise<T>
	removeMany: (keys: string[]) => void
}

export const cache: SessionStorage = {
	get: (key: string) => {
		const value = sessionStorage.getItem(key)
		if (value) {
			return JSON.parse(value)
		}
		return undefined
	},
	set: (key: string, value: unknown) => {
		sessionStorage.setItem(key, JSON.stringify(value))
	},
	remove: (key: string) => {
		sessionStorage.removeItem(key)
	},
	clear: () => {
		sessionStorage.clear()
	},
	setAsync: async <T>(cacheKey: string, asyncData: Record<string, unknown>) => {
		const resolved = {}

		for (const [key, value] of Object.entries(asyncData)) {
			if (value instanceof Promise) {
				Object.assign(resolved, { [key]: await value })
			} else {
				Object.assign(resolved, { [key]: value })
			}
		}

		cache.set(cacheKey, resolved)

		return resolved as T
	},
	removeMany: (keys: string[]) => {
		for (const key of keys) {
			sessionStorage.removeItem(key)
		}
	},
}
