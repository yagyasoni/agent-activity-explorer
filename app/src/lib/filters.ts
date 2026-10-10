import type { EventFilters } from '../types/events'

export const EMPTY_FILTERS: EventFilters = {
  q: '',
  agents: [],
  status: null,
}

export function hasActiveFilters(f: EventFilters): boolean {
  return (
    f.q.trim() !== '' ||
    f.agents.length > 0 ||
    f.status !== null ||
    f.from !== undefined ||
    f.to !== undefined
  )
}
