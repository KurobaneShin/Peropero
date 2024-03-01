## Development

```shellscript
bun i
bun run dev
```

## Deployment

First, build your app for production:

```sh
bun run build
bun build-vercel-serverless
bun release-vercel-serverless
```

Then run the app in production mode:

```sh
bun start
```
