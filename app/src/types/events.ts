export type EventStatus = 'ok' | 'blocked' | 'error'

export const EVENT_STATUSES: readonly EventStatus[] = ['ok', 'blocked', 'error']

export interface EventListItem {
  id: string
  timestamp: string
  agent: string
  tool: string
  status: EventStatus
  latencyMs: number
  argsPreview: string
}

export interface EventDetail extends Omit<EventListItem, 'argsPreview'> {
  args: unknown
  result: unknown
  policyMatches: string[]
}

export interface EventsPage {
  items: EventListItem[]
  nextCursor: string | null
  total: number
}

export interface EventFilters {
  q: string
  agents: string[]
  status: EventStatus | null
  from?: string
  to?: string
}
