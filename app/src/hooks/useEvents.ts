import { useEffect, useState } from 'react'
import { fetchEvents, toError } from '../lib/api'
import type { EventFilters, EventsPage } from '../types/events'
import type { EventListState } from '../types/state'

const SLOW_AFTER_MS = 3000

type Loaded = { key: string; page: EventsPage; loadMoreError?: Error }
type Failed = { key: string; error: Error }

export function useEvents(filters: EventFilters): EventListState {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Loaded | Failed | null>(null)
  const [slowKey, setSlowKey] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  // one key per request: the current filters plus a retry counter
  const key = JSON.stringify(filters) + attempt

  useEffect(() => {
    const controller = new AbortController()
    const slowTimer = setTimeout(() => setSlowKey(key), SLOW_AFTER_MS)

    fetchEvents(filters, { signal: controller.signal })
      .then((page) => setResult({ key, page }))
      .catch((err) => {
        if (!controller.signal.aborted) setResult({ key, error: toError(err) })
      })

    return () => {
      controller.abort()
      clearTimeout(slowTimer)
    }
  }, [key, filters])

  const current = result?.key === key ? result : null
  const loaded = current && 'page' in current ? current : null

  // ignore a "load more" response if the filters changed while it was in flight
  const patchLoaded = (fn: (prev: Loaded) => Loaded) => {
    setResult((prev) => (prev && prev.key === key && 'page' in prev ? fn(prev) : prev))
  }

  const loadMore = () => {
    if (!loaded?.page.nextCursor || loadingMore) return
    setLoadingMore(true)
    fetchEvents(filters, { cursor: loaded.page.nextCursor })
      .then((next) =>
        patchLoaded((prev) => ({ key, page: { ...next, items: [...prev.page.items, ...next.items] } })),
      )
      .catch((err) => patchLoaded((prev) => ({ ...prev, loadMoreError: toError(err) })))
      .finally(() => setLoadingMore(false))
  }

  const state: EventListState = {
    phase: 'loading',
    isSlow: false,
    isRefreshing: false,
    items: [],
    total: null,
    hasMore: false,
    isLoadingMore: false,
    loadMoreError: null,
    error: null,
    loadMore,
    retry: () => setAttempt((n) => n + 1),
  }

  if (current && 'error' in current) {
    return { ...state, phase: 'error', error: current.error }
  }

  if (loaded) {
    return {
      ...state,
      phase: 'ready',
      items: loaded.page.items,
      total: loaded.page.total,
      hasMore: loaded.page.nextCursor !== null,
      isLoadingMore: loadingMore,
      loadMoreError: loaded.loadMoreError ?? null,
    }
  }

  // filters changed: keep the old rows on screen, dimmed, until the new page lands
  const previous = result && 'page' in result ? result.page : null
  if (previous && previous.items.length > 0) {
    return {
      ...state,
      phase: 'ready',
      isRefreshing: true,
      items: previous.items,
      total: previous.total,
      hasMore: previous.nextCursor !== null,
    }
  }

  return { ...state, isSlow: slowKey === key }
}
