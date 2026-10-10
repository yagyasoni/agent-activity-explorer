import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import s from './states.module.css'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={s.centered} role="status">
      <span className={s.icon}>
        <Inbox size={20} />
      </span>
      <p className={s.title}>{title}</p>
      {description && <p className={s.description}>{description}</p>}
      {action && <div className={s.actions}>{action}</div>}
    </div>
  )
}
