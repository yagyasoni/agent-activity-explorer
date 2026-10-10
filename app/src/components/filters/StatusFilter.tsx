import type { EventStatus } from '../../types/events'
import s from './StatusFilter.module.css'

interface StatusFilterProps {
  value: EventStatus | null
  onChange: (value: EventStatus | null) => void
}

const OPTIONS: Array<{ value: EventStatus | null; label: string }> = [
  { value: null, label: 'All' },
  { value: 'ok', label: 'OK' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'error', label: 'Error' },
]

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <fieldset className={s.group}>
      <legend className={s.legend}>Status</legend>
      {OPTIONS.map((opt) => {
        const key = opt.value ?? 'all'
        return (
          <label key={key} className={s.option} data-status={key}>
            <input
              type="radio"
              name="status"
              className={s.input}
              value={key}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span className={s.label}>
              {opt.value && <span className={s.dot} aria-hidden="true" />}
              {opt.label}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}
