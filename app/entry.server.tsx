import { RemixServer } from "@remix-run/react"
import { type EntryContext, handleRequest } from "@vercel/remix"
export default function (
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
) {
	responseHeaders.append(
		"Cache-Control",
		"s-maxage=1, stale-while-revalidate=59",
	)

	const remixServer = <RemixServer context={remixContext} url={request.url} />
	return handleRequest(
		request,
		responseStatusCode,
		responseHeaders,
		remixServer,
	)
}
