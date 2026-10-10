import { formatCount } from '../../lib/format'
import { Skeleton } from '../ui/Skeleton'
import s from './ResultsSummary.module.css'

interface ResultsSummaryProps {
  total: number | null
  shown: number
  isRefreshing: boolean
}

export function ResultsSummary({ total, shown, isRefreshing }: ResultsSummaryProps) {
  return (
    <div className={s.root} aria-live="polite">
      {total === null ? (
        <Skeleton width={140} />
      ) : (
        <span className={s.text} data-stale={isRefreshing}>
          <strong>{formatCount(total)}</strong> {total === 1 ? 'event' : 'events'}
          {shown > 0 && total > shown && (
            <>
              <span className={s.sep}>·</span>
              {formatCount(shown)} loaded
            </>
          )}
        </span>
      )}
    </div>
  )
}
