import { Button } from '../ui/Button'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import s from './states.module.css'

interface ErrorStateProps {
  title: string
  error?: Error | null
  onRetry?: () => void
  compact?: boolean
}

export function ErrorState({ title, error, onRetry, compact = false }: ErrorStateProps) {
  if (compact) {
    return (
      <div className={s.compact} role="alert">
        <TriangleAlert size={16} className={s.slowIcon} style={{ color: 'var(--error)' }} />
        <div className={s.grow}>
          <div>{title}</div>
          {error && <div className={s.detail}>{error.message}</div>}
        </div>
        {onRetry && (
          <Button size="sm" onClick={onRetry}>
            <RefreshCw size={14} />
            Retry
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={s.centered} role="alert">
      <span className={s.iconError}>
        <TriangleAlert size={20} />
      </span>
      <p className={s.title}>{title}</p>
      {error && <p className={s.detail}>{error.message}</p>}
      {onRetry && (
        <div className={s.actions}>
          <Button variant="primary" onClick={onRetry}>
            <RefreshCw size={14} />
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}
