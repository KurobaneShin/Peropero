#!/bin/bash
set -eu -o pipefail

# .vercel/
#   project.json
#   output/
#     config.json
#     static/              = build/client
#     functions/
#       index.func/
#         .vc-config.json
#         index.mjs         = app/adapters/vercel-serverless.ts

cd "$(dirname "${BASH_SOURCE[0]}")"

# clean
rm -rf .vercel/output
mkdir -p .vercel/output

# config.json
cp config.json .vercel/output/config.json

# static
mkdir -p .vercel/output/static
cp -r ../../build/client/. .vercel/output/static
rm -rf .vercel/output/static/.vite

# functions
mkdir -p .vercel/output/functions/index.func
cp .vc-config.json .vercel/output/functions/index.func/.vc-config.json

npx esbuild ../../server.mjs \
  --outfile=.vercel/output/functions/index.func/index.mjs \
  --metafile=../../build/esbuild-metafile-vercel-serverless.json \
  --define:process.env.NODE_ENV='"production"' \
  --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);" \
  --bundle --minify --format=esm --platform=node

