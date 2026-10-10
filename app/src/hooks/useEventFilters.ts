import { useEffect, useState } from 'react'
import { EVENT_STATUSES, type EventFilters } from '../types/events'
import { EMPTY_FILTERS, hasActiveFilters } from '../lib/filters'

const FILTER_PARAMS = ['q', 'agent', 'status', 'from', 'to']

function readFilters(): EventFilters {
  const params = new URLSearchParams(window.location.search)
  const status = params.get('status')
  return {
    q: params.get('q') ?? '',
    agents: params.getAll('agent'),
    status: EVENT_STATUSES.find((s) => s === status) ?? null,
    from: params.get('from') ?? undefined,
    to: params.get('to') ?? undefined,
  }
}

function writeFilters(filters: EventFilters, replace: boolean) {
  // start from the current URL so unrelated params (the open event) survive
  const params = new URLSearchParams(window.location.search)
  FILTER_PARAMS.forEach((name) => params.delete(name))
  if (filters.q) params.set('q', filters.q)
  filters.agents.forEach((agent) => params.append('agent', agent))
  if (filters.status) params.set('status', filters.status)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)

  const query = params.toString()
  const url = query ? `?${query}` : window.location.pathname
  if (replace) window.history.replaceState(null, '', url)
  else window.history.pushState(null, '', url)
}

export function useEventFilters() {
  const [filters, setFilters] = useState<EventFilters>(readFilters)

  useEffect(() => {
    const onPopState = () => {
      const next = readFilters()
      // keep the same object when nothing changed so the list doesn't refetch
      setFilters((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const patch = (changes: Partial<EventFilters>) => {
    const next = { ...filters, ...changes }
    // editing an existing search updates the current history entry instead of adding one per keystroke
    const typing = 'q' in changes && filters.q !== '' && next.q !== ''
    writeFilters(next, typing)
    setFilters(next)
  }

  const clear = () => {
    writeFilters(EMPTY_FILTERS, false)
    setFilters(EMPTY_FILTERS)
  }

  return { filters, patch, clear, isActive: hasActiveFilters(filters) }
}
