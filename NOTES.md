# NOTES

## Framework: React with Vite

I chose Vite because this app has no server side. Everything happens in the browser, so SSR, API routes and the rest of what Next.js brings would go unused. I also wanted to manage URL state myself with the history API instead of going through a router. And Vite is quick: it starts instantly, the template is almost empty, and the build is a plain static bundle.

## What I built

All four Core items are done.

From Polish I did all five. They were small to add on top of the base, and they are the things I notice first as a user: arrow keys and Enter in the list, a drawer layout on tablet, focus moving into the panel and back out, dark mode from the system setting, and no animation when reduced motion is on.

From Stretch I picked tests only. The URL sync, load more and error paths are the parts most likely to break, so the tests cover those. One thing done properly felt better than a half-done chart or live mode.

## Tradeoffs and what I'd do differently

- Load more button instead of infinite scroll. Simpler, and the user decides when the list grows.
- Search fires on every keystroke and cancels the previous request. That is fine against the mock API. For a real one I would add a short debounce.
- No router library. The URL state is about forty lines by hand, which is enough for one view.
- Axios instead of fetch, mainly for the query serialisation and cancellation.
- With more time: the histogram chart with a drag-to-select range, then a hand-built virtualized list.

## Known issues

No issues as such.

## How I used AI tools

I used Claude Code in VS Code for three things: the basic UI structure (folder layout and component skeleton), fixing ESLint errors, and working through a few errors I was stuck on. The data layer, URL sync, pagination, loading and error states, and the tests are my own.
