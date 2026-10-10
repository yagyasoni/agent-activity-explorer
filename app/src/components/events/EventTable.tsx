import type { ReactNode } from 'react'
import type { EventListState } from '../../types/state'
import { EventRow } from './EventRow'
import { ResultsSummary } from './ResultsSummary'
import { LoadMore } from './LoadMore'
import { LoadingBar } from '../states/LoadingBar'
import { SkeletonRows } from '../states/SkeletonRows'
import { SlowNetworkNotice } from '../states/SlowNetworkNotice'
import { EmptyState } from '../states/EmptyState'
import { ErrorState } from '../states/ErrorState'
import s from './EventTable.module.css'

interface EventTableProps {
  state: EventListState
  selectedId: string | null
  onSelect: (id: string) => void
  emptyAction?: ReactNode
}

const SKELETON_WIDTHS = ['80%', '60%', '70%', 56, '50%']

export function EventTable({ state, selectedId, onSelect, emptyAction }: EventTableProps) {
  const {
    phase,
    isSlow,
    isRefreshing,
    items,
    total,
    hasMore,
    isLoadingMore,
    loadMoreError,
    error,
    loadMore,
    retry,
  } = state

  const isEmpty = phase === 'ready' && items.length === 0
  const showTable = phase === 'loading' || (phase === 'ready' && items.length > 0)

  return (
    <section
      className={s.root}
      aria-label="Events"
      aria-busy={phase === 'loading' || isRefreshing || undefined}
    >
      <ResultsSummary total={total} shown={items.length} isRefreshing={isRefreshing} />
      <LoadingBar active={isRefreshing} />

      <div className={s.scroller} data-stale={isRefreshing}>
        {showTable && (
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col" className={s.colTime}>
                  Timestamp
                </th>
                <th scope="col" className={s.colAgent}>
                  Agent
                </th>
                <th scope="col" className={s.colTool}>
                  Tool
                </th>
                <th scope="col" className={s.colStatus}>
                  Status
                </th>
                <th scope="col" className={s.colLatency}>
                  Latency
                </th>
              </tr>
            </thead>
            <tbody>
              {phase === 'loading' ? (
                <SkeletonRows widths={SKELETON_WIDTHS} />
              ) : (
                items.map((event) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    selected={event.id === selectedId}
                    onSelect={onSelect}
                  />
                ))
              )}
            </tbody>
          </table>
        )}

        {phase === 'loading' && isSlow && <SlowNetworkNotice onRetry={retry} />}

        {phase === 'error' && (
          <div className={s.stateWrap}>
            <ErrorState title="Couldn't load events" error={error} onRetry={retry} />
          </div>
        )}

        {isEmpty && (
          <div className={s.stateWrap}>
            <EmptyState
              title="No events match"
              description="Try a different search, or widen the agent and status filters."
              action={emptyAction}
            />
          </div>
        )}

        {phase === 'ready' && items.length > 0 && (
          <LoadMore
            shown={items.length}
            total={total}
            hasMore={hasMore}
            isLoading={isLoadingMore}
            error={loadMoreError}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </section>
  )
}
