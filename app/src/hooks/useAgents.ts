import { useEffect, useState } from 'react'
import { fetchAgents, toError } from '../lib/api'
import type { AgentsState } from '../types/state'

export function useAgents(): AgentsState {
  const [attempt, setAttempt] = useState(0)
  const [items, setItems] = useState<string[]>([])
  const [status, setStatus] = useState<AgentsState['status']>('loading')
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchAgents(controller.signal)
      .then((agents) => {
        setItems(agents)
        setStatus('ready')
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setError(toError(err))
        setStatus('error')
      })

    return () => controller.abort()
  }, [attempt])

  const retry = () => {
    setStatus('loading')
    setError(null)
    setAttempt((n) => n + 1)
  }

  return { status, items, error, retry }
}
