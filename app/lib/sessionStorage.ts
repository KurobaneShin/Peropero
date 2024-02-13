export type SessionStorage = {
	get: (key: string) => any
	set: (key: string, value: any) => void
	remove: (key: string) => void
	clear: () => void
	setAsync: <T>(cacheKey: string, asyncData: any) => Promise<T>
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
	set: (key: string, value: any) => {
		sessionStorage.setItem(key, JSON.stringify(value))
	},
	remove: (key: string) => {
		sessionStorage.removeItem(key)
	},
	clear: () => {
		sessionStorage.clear()
	},
	setAsync: async <T>(cacheKey: string, asyncData: any) => {
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
