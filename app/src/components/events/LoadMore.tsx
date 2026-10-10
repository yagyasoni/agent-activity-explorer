import { formatCount } from '../../lib/format'
import { Button } from '../ui/Button'
import { ErrorState } from '../states/ErrorState'
import s from './LoadMore.module.css'

interface LoadMoreProps {
  shown: number
  total: number | null
  hasMore: boolean
  isLoading: boolean
  error: Error | null
  onLoadMore: () => void
}

export function LoadMore({ shown, total, hasMore, isLoading, error, onLoadMore }: LoadMoreProps) {
  return (
    <div className={s.root}>
      <div className={s.sentinel} aria-hidden="true" />

      {error ? (
        <ErrorState compact title="Couldn't load the next page" error={error} onRetry={onLoadMore} />
      ) : hasMore ? (
        <Button variant="secondary" loading={isLoading} onClick={onLoadMore}>
          {isLoading ? 'Loading more…' : 'Load more'}
        </Button>
      ) : (
        <p className={s.end}>You've reached the end</p>
      )}

      {total !== null && (
        <p className={s.meta}>
          Showing {formatCount(shown)} of {formatCount(total)}
        </p>
      )}
    </div>
  )
}
