import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { afterEach, expect, it, vi } from 'vitest'
import { fetchEvent, fetchEvents } from '../lib/api'
import { EMPTY_FILTERS } from '../lib/filters'
import { useEventFilters } from '../hooks/useEventFilters'
import { useEvents } from '../hooks/useEvents'
import { useEventDetail } from '../hooks/useEventDetail'
import { EventTable } from '../components/events/EventTable'
import type { EventListItem } from '../types/events'
import type { EventListState } from '../types/state'

// use fake API calls so the tests never touch the network
vi.mock('../lib/api', async () => ({
  ...(await vi.importActual('../lib/api')),
  fetchEvents: vi.fn(),
  fetchEvent: vi.fn(),
}))

const fakeFetchEvents = vi.mocked(fetchEvents)
const fakeFetchEvent = vi.mocked(fetchEvent)

const fakeEvent: EventListItem = {
  id: 'evt_1',
  timestamp: '2026-10-09T14:21:07.123Z',
  agent: 'billing-assistant',
  tool: 'http.request',
  status: 'ok',
  latencyMs: 412,
  argsPreview: '{}',
}

const emptyTable: EventListState = {
  phase: 'ready',
  isSlow: false,
  isRefreshing: false,
  items: [],
  total: 0,
  hasMore: false,
  isLoadingMore: false,
  loadMoreError: null,
  error: null,
  loadMore: vi.fn(),
  retry: vi.fn(),
}

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  window.history.replaceState(null, '', '/')
})

it('filters are read from the URL, written back to it, and follow the back button', () => {
  window.history.replaceState(null, '', '?q=stripe&status=error')
  const { result } = renderHook(() => useEventFilters())

  expect(result.current.filters.q).toBe('stripe')
  expect(result.current.filters.status).toBe('error')

  act(() => result.current.patch({ status: 'ok' }))
  expect(window.location.search).toBe('?q=stripe&status=ok')

  // the browser goes back to the older URL
  window.history.replaceState(null, '', '?q=stripe&status=error')
  act(() => window.dispatchEvent(new PopStateEvent('popstate')))
  expect(result.current.filters.status).toBe('error')
})

it('load more adds the next page, and a failed page can be retried', async () => {
  fakeFetchEvents.mockResolvedValueOnce({ items: [fakeEvent], nextCursor: 'page-2', total: 2 })
  const { result } = renderHook(() => useEvents(EMPTY_FILTERS))
  await waitFor(() => expect(result.current.items).toHaveLength(1))

  // the next page fails, the first page stays on screen
  fakeFetchEvents.mockRejectedValueOnce(new Error('500'))
  act(() => result.current.loadMore())
  await waitFor(() => expect(result.current.loadMoreError).not.toBeNull())
  expect(result.current.items).toHaveLength(1)

  // trying again works
  fakeFetchEvents.mockResolvedValueOnce({ items: [{ ...fakeEvent, id: 'evt_2' }], nextCursor: null, total: 2 })
  act(() => result.current.loadMore())
  await waitFor(() => expect(result.current.items).toHaveLength(2))
  expect(result.current.hasMore).toBe(false)
})

it('a missing event shows a friendly message instead of a raw 404', async () => {
  const notFound = new AxiosError('Not found')
  notFound.response = { status: 404 } as AxiosResponse
  fakeFetchEvent.mockRejectedValueOnce(notFound)

  const { result } = renderHook(() => useEventDetail('evt_missing'))
  await waitFor(() => expect(result.current.status).toBe('error'))

  const state = result.current
  if (state.status === 'error') expect(state.error.message).toContain('does not exist')
})

it('the table shows the error with a retry button', async () => {
  const retry = vi.fn()
  const state: EventListState = { ...emptyTable, phase: 'error', error: new Error('502 Bad Gateway'), retry }
  render(<EventTable state={state} selectedId={null} onSelect={vi.fn()} />)

  expect(screen.getByText("Couldn't load events")).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(retry).toHaveBeenCalled()
})

it('the table shows an empty message when nothing matches', () => {
  render(<EventTable state={emptyTable} selectedId={null} onSelect={vi.fn()} />)
  expect(screen.getByText('No events match')).toBeInTheDocument()
})
