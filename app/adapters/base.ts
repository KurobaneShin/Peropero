import { createRequestHandler, type ServerBuild } from "@remix-run/server-node";

// @ts-ignore
import * as build from "../../build/server/index.js";

export const remixHandler = createRequestHandler(
  build as any as ServerBuild,
  "production"
);
