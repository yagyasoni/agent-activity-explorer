import type { EventDetail } from '../../types/events'
import { formatLatency, formatTimestamp } from '../../lib/format'
import { StatusBadge } from '../events/StatusBadge'
import s from './DetailSummary.module.css'

export function DetailSummary({ event }: { event: EventDetail }) {
  return (
    <dl className={s.grid}>
      <dt>Timestamp</dt>
      <dd>
        <time dateTime={event.timestamp} className={s.mono}>
          {formatTimestamp(event.timestamp)}
        </time>
      </dd>

      <dt>Agent</dt>
      <dd>{event.agent}</dd>

      <dt>Tool</dt>
      <dd>
        <code>{event.tool}</code>
      </dd>

      <dt>Status</dt>
      <dd>
        <StatusBadge status={event.status} />
      </dd>

      <dt>Latency</dt>
      <dd className={s.mono}>{formatLatency(event.latencyMs)}</dd>
    </dl>
  )
}
