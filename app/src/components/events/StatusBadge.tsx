import type { EventStatus } from '../../types/events'
import s from './StatusBadge.module.css'

const LABELS: Record<EventStatus, string> = {
  ok: 'OK',
  blocked: 'Blocked',
  error: 'Error',
}

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={s.badge} data-status={status}>
      <span className={s.dot} aria-hidden="true" />
      {LABELS[status]}
    </span>
  )
}
