import { useCallback, useEffect, useRef, useState } from 'react'

function readEventId() {
  return new URLSearchParams(window.location.search).get('event')
}

function writeEventId(id: string | null) {
  const params = new URLSearchParams(window.location.search)
  if (id) params.set('event', id)
  else params.delete('event')
  const query = params.toString()
  window.history.pushState(null, '', query ? `?${query}` : window.location.pathname)
}

export function useSelectedEvent() {
  const [selectedId, setSelectedId] = useState<string | null>(readEventId)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onPopState = () => setSelectedId(readEventId())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const select = useCallback((id: string) => {
    if (readEventId() === id) return
    openerRef.current = document.activeElement as HTMLElement | null
    writeEventId(id)
    setSelectedId(id)
  }, [])

  const close = useCallback(() => {
    if (readEventId() === null) return
    writeEventId(null)
    setSelectedId(null)
    openerRef.current?.focus()
  }, [])

  return { selectedId, select, close }
}
