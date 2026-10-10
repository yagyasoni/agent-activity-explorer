# Perf clinic

Checked in Chrome DevTools (Network, Performance and Coverage panels) with cache disabled, served with `npm run perf-clinic`.

### 1. Search does a full-text pass over every event on each keystroke
- **Symptom:** Typing in the search box lags behind, the page freezes while you type, and typing `status` matches every row.
- **How I found it:** Typing was the first thing that felt wrong. A Performance recording while typing shows a long task on every keystroke, inside `search()`.
- **Root cause:** On every keystroke `search()` turns each event into a JSON string to match against, then sorts the matches with `new Date()` inside the comparator. The JSON also contains the property names, which is why `status` matches everything.
- **Fix:** Sort the list once at load, keep a lowercase search string per event, and filter on that.
- **Before / after:** Typing used to freeze the page on every character; now the text appears as you type. Searching `status` used to match every row and now matches none.

### 2. Scroll handler measures every row and scans the whole list on each scroll event
- **Symptom:** Scrolling the list stutters, and a band of several rows lights up at once, which looks like random rows being hovered.
- **How I found it:** Visible while scrolling. A Performance recording shows a long task on every scroll event, inside `onScroll`.
- **Root cause:** On every scroll event `onScroll` toggles a class on every row and calls `getBoundingClientRect()` on each, filters the whole list formatting a Date per event just to count calls in that minute, and changes the sticky header's padding. The focus check matches every row inside a band about a third of the viewport tall, so several rows match.
- **Fix:** Count calls per minute once at load into a Map. Pick the single row at the middle of the viewport with `elementFromPoint` and only change classes when that row changes. The header shrink moved into the existing `topbar-raised` class.
- **Before / after:** Several rows used to light up at once and scrolling stuttered; now only the row in the middle of the screen is highlighted and scrolling is smooth.

### 3. localStorage written inside the render loop
- **Symptom:** Every keystroke gets a little slower the longer you use the page.
- **How I found it:** Reading `rememberViewed`: the `localStorage.setItem` call is inside the `for` loop. Application -> Local Storage shows the viewed list growing with every search.
- **Root cause:** The whole viewed-ids list is turned into JSON and written to localStorage once for every rendered row, and the list only ever grows.
- **Fix:** Moved the `setItem` call after the loop.
- **Before / after:** The list used to be written once for every row drawn; now it is written once after the rows are drawn, so a render no longer gets slower as the list grows.

### 4. JS resizing cards and summaries in loops
- **Symptom:** Cards in a row have different heights for a moment and shuffle as the avatars load. Resizing the window is sluggish.
- **How I found it:** Visible on load and when resizing. Reading `equalizeCardHeights` and `fitSummaries`, and a Performance recording of a resize shows both running with forced reflow warnings.
- **Root cause:** Both functions read layout values (`offsetTop`, `offsetHeight`, `scrollWidth`) and write styles inside loops, so the browser lays the page out again at every step. The equaliser also runs again for every avatar that finishes loading.
- **Fix:** Deleted both. CSS grid gives equal row heights once `align-items: start` is removed, `min-height: 220px` replaces the JS minimum, and the card is a flex column so the "calls today" line lines up across a row. Summaries already had `text-overflow: ellipsis`. Avatars got `width`/`height` so cards do not grow when the images arrive.
- **Before / after:** Nothing runs on resize anymore, and the cards keep the same height from the first paint instead of jumping while the avatars load.

### 5. Oversized images for one hero and twelve small avatars
- **Symptom:** Slow first load; the hero shows up late.
- **How I found it:** Network panel sorted by size. `hero.png` is 4.2 MB and each `agent-XX.png` is about 160 KB at 320x320 while being shown at 48x48.
- **Root cause:** Wrong format and wrong size. The hero is a noisy gradient saved as PNG, which cannot compress grain, and the avatars are far bigger than their slot.
- **Fix:** Hero re-encoded as WebP at quality 60, avatars resized to 96x96, and `width`/`height` set on both.
- **Before / after:** Hero 4.2 MB -> 271 KB; each avatar 160 KB -> 11 KB. The Network panel's transferred total went from 6.5 MB to under 500 KB.

### 6. Large stylesheet with nothing in use
- **Symptom:** Slower first paint.
- **How I found it:** Second largest file in the Network panel. The Coverage tab shows `theme.css` at 0% used, and `index.html` links two stylesheets while `app.css` already covers the whole page.
- **Root cause:** A utility CSS framework is linked but none of its class names appear in the page. It blocks rendering while it downloads and parses.
- **Fix:** Removed the link and the file.
- **Before / after:** `theme.css` at 319 KB is gone; only the 5 KB `app.css` is loaded.

### 7. Live calls panel keeps running after it is closed
- **Symptom:** After opening and closing "Show live calls" a few times the page gets slower, and memory grows while nothing is visible.
- **How I found it:** Reading `closeTicker`: there is no `clearInterval`. The Performance monitor shows the JS heap climbing while the panel is closed.
- **Root cause:** The `setInterval` keeps building rows into the removed list. Each open adds another resize and keydown listener on `window`, and `renderedTickerRows` keeps a DOM node for every event ever shown.
- **Fix:** Clear the interval and remove the keydown listener on close, and drop the cache since a row is cheap to build. The panel's max height is now CSS so the resize listener is gone.
- **Before / after:** The timer used to keep running after the panel was closed, and every open stacked another one on top; now closing the panel stops it and memory stays flat.
