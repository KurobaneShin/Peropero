import { createCookieSessionStorage } from "@remix-run/server-node";

import { createThemeSessionResolver } from "remix-themes";
export const accessToken = createCookieSessionStorage({
  cookie: {
    name: "accessToken",
    maxAge: 604_800, // one week
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret1"],
    secure: process.env.ENVIRONMENT !== "development",
  },
});

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
