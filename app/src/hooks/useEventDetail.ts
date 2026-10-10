import { useEffect, useState } from 'react'
import { fetchEvent, isNotFound, toError } from '../lib/api'
import type { EventDetail } from '../types/events'
import type { EventDetailState } from '../types/state'

const SLOW_AFTER_MS = 3000

type Result = { key: string; event: EventDetail } | { key: string; error: Error }

export function useEventDetail(id: string | null): EventDetailState {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [slowKey, setSlowKey] = useState<string | null>(null)

  const key = `${id}#${attempt}`

  useEffect(() => {
    if (id === null) return
    const controller = new AbortController()
    const slowTimer = setTimeout(() => setSlowKey(key), SLOW_AFTER_MS)

    fetchEvent(id, controller.signal)
      .then((event) => {
        if (!controller.signal.aborted) setResult({ key, event })
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        const error = isNotFound(err)
          ? new Error('This event does not exist, or the link is out of date.')
          : toError(err)
        setResult({ key, error })
      })

    return () => {
      controller.abort()
      clearTimeout(slowTimer)
    }
  }, [id, key])

  if (id === null) return { status: 'idle' }

  if (!result || result.key !== key) {
    return { status: 'loading', isSlow: slowKey === key }
  }

  if ('error' in result) {
    return { status: 'error', error: result.error, retry: () => setAttempt((n) => n + 1) }
  }

  return { status: 'ready', event: result.event }
}
