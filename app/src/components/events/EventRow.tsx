import type { KeyboardEvent } from 'react'
import type { EventListItem } from '../../types/events'
import { formatLatency, formatTimestamp, latencyLevel } from '../../lib/format'
import { StatusBadge } from './StatusBadge'
import s from './EventRow.module.css'

interface EventRowProps {
  event: EventListItem
  selected: boolean
  onSelect: (id: string) => void
}

export function EventRow({ event, selected, onSelect }: EventRowProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(event.id)
    }
  }

  return (
    <tr
      className={s.row}
      tabIndex={0}
      aria-current={selected ? 'true' : undefined}
      onClick={() => onSelect(event.id)}
      onKeyDown={onKeyDown}
    >
      <td className={s.time}>
        <time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time>
      </td>
      <td className={s.agent}>{event.agent}</td>
      <td className={s.tool}>
        <code>{event.tool}</code>
      </td>
      <td>
        <StatusBadge status={event.status} />
      </td>
      <td className={s.latency} data-level={latencyLevel(event.latencyMs)}>
        {formatLatency(event.latencyMs)}
      </td>
    </tr>
  )
}
