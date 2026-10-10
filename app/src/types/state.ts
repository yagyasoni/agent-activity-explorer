import type { EventDetail, EventListItem } from './events'

export interface EventListState {
  phase: 'loading' | 'error' | 'ready'
  isSlow: boolean
  isRefreshing: boolean
  items: EventListItem[]
  total: number | null
  hasMore: boolean
  isLoadingMore: boolean
  loadMoreError: Error | null
  error: Error | null
  loadMore: () => void
  retry: () => void
}

export type EventDetailState =
  | { status: 'idle' }
  | { status: 'loading'; isSlow: boolean }
  | { status: 'error'; error: Error; retry: () => void }
  | { status: 'ready'; event: EventDetail }

export interface AgentsState {
  status: 'loading' | 'error' | 'ready'
  items: string[]
  error: Error | null
  retry: () => void
}
