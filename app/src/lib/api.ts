import axios from 'axios'
import type { EventDetail, EventFilters, EventsPage } from '../types/events'

export const PAGE_SIZE = 50

const api = axios.create({
  baseURL: 'http://localhost:4000',
  // the API expects repeated params (agent=a&agent=b), not agent[]=a
  paramsSerializer: { indexes: null },
})

export async function fetchEvents(
  filters: EventFilters,
  options: { cursor?: string | null; signal?: AbortSignal } = {},
) {
  const res = await api.get<EventsPage>('/events', {
    params: {
      q: filters.q || undefined,
      agent: filters.agents,
      status: filters.status,
      from: filters.from,
      to: filters.to,
      cursor: options.cursor,
      limit: PAGE_SIZE,
    },
    signal: options.signal,
  })
  return res.data
}

export async function fetchEvent(id: string, signal?: AbortSignal) {
  const res = await api.get<EventDetail>(`/events/${id}`, { signal })
  return res.data
}

export async function fetchAgents(signal?: AbortSignal) {
  const res = await api.get<string[]>('/agents', { signal })
  return res.data
}

export function isNotFound(err: unknown) {
  return axios.isAxiosError(err) && err.response?.status === 404
}

export function toError(err: unknown) {
  return err instanceof Error ? err : new Error(String(err))
}
