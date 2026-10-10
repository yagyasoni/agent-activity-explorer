import { useEffect, useRef, useState } from 'react'
import type { EventDetailState } from '../../types/state'
import { Button } from '../ui/Button'
import { Check, Copy, Link, X } from 'lucide-react'
import { ErrorState } from '../states/ErrorState'
import { SlowNetworkNotice } from '../states/SlowNetworkNotice'
import { DetailSection } from './DetailSection'
import { DetailSummary } from './DetailSummary'
import { DetailSkeleton } from './DetailSkeleton'
import { JsonBlock } from './JsonBlock'
import { PolicyMatches } from './PolicyMatches'
import { formatJson } from '../../lib/format'
import s from './DetailPanel.module.css'

interface DetailPanelProps {
  eventId: string
  state: EventDetailState
  onClose: () => void
}

export function DetailPanel({ eventId, state, onClose }: DetailPanelProps) {
  const panelRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const copyJson = (value: unknown) => {
    navigator.clipboard.writeText(formatJson(value))
  }

  useEffect(() => {
    panelRef.current?.focus()
  }, [eventId])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <section
      ref={panelRef}
      className={s.panel}
      role="dialog"
      aria-labelledby="detail-title"
      tabIndex={-1}
    >
      <header className={s.header}>
        <div className={s.heading}>
          <p className={s.eyebrow}>Event</p>
          <h2 id="detail-title" className={s.title}>
            {eventId}
          </h2>
        </div>
        <div className={s.actions}>
          <Button
            iconOnly
            variant="ghost"
            onClick={copyLink}
            aria-label={copied ? 'Link copied' : 'Copy link to this event'}
            title={copied ? 'Copied' : 'Copy link'}
          >
            {copied ? <Check size={16} /> : <Link size={16} />}
          </Button>
          <Button iconOnly variant="ghost" onClick={onClose} aria-label="Close panel" title="Close (Esc)">
            <X size={16} />
          </Button>
        </div>
      </header>

      <div className={s.body}>
        {state.status === 'loading' && (
          <>
            {state.isSlow && <SlowNetworkNotice message="Still loading this event…" />}
            <DetailSkeleton />
          </>
        )}

        {state.status === 'error' && (
          <ErrorState title="Couldn't load this event" error={state.error} onRetry={state.retry} />
        )}

        {state.status === 'ready' && (
          <>
            <DetailSummary event={state.event} />

            <DetailSection title="Policy matches">
              <PolicyMatches matches={state.event.policyMatches} />
            </DetailSection>

            <DetailSection
              title="Arguments"
              action={
                <Button size="sm" variant="ghost" aria-label="Copy arguments" onClick={() => copyJson(state.event.args)}>
                  <Copy size={14} />
                  Copy
                </Button>
              }
            >
              <JsonBlock value={state.event.args} label="Arguments" />
            </DetailSection>

            <DetailSection
              title="Result"
              action={
                <Button size="sm" variant="ghost" aria-label="Copy result" onClick={() => copyJson(state.event.result)}>
                  <Copy size={14} />
                  Copy
                </Button>
              }
            >
              <JsonBlock value={state.event.result} label="Result" />
            </DetailSection>
          </>
        )}
      </div>

      <footer className={s.footer}>
        Press <kbd>Esc</kbd> to close
      </footer>
    </section>
  )
}
