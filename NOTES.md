# NOTES

## Framework: React with Vite

I chose Vite because this app has no server side. Everything happens in the browser, so SSR, API routes and the rest of what Next.js brings would go unused. I also wanted to manage URL state myself with the history API instead of going through a router. And Vite is quick: it starts instantly, the template is almost empty, and the build is a plain static bundle.

## What I built

[Core items done, which Polish / Stretch items you picked and why]

## Tradeoffs and what I'd do differently

[e.g. load-more button vs infinite scroll, axios vs fetch, no router, what you'd add with more time]

## Known issues

[anything broken or incomplete]

## How I used AI tools

I used Claude Code in VS Code for the UI component structure and a first draft of this file. The API client, URL sync for filters and the detail panel, pagination and the loading / error / slow-network handling I wrote myself.
