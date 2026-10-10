import { Button } from '../ui/Button'
import { Clock } from 'lucide-react'
import { Spinner } from '../ui/Spinner'
import s from './states.module.css'

interface SlowNetworkNoticeProps {
  message?: string
  onRetry?: () => void
}

export function SlowNetworkNotice({
  message = 'Still working. The API is responding slowly.',
  onRetry,
}: SlowNetworkNoticeProps) {
  return (
    <div className={s.slow} role="status" aria-live="polite">
      <Spinner size={16} />
      <Clock size={16} className={s.slowIcon} />
      <span className={s.grow}>{message}</span>
      {onRetry && (
        <Button size="sm" variant="ghost" onClick={onRetry}>
          Retry now
        </Button>
      )}
    </div>
  )
}
