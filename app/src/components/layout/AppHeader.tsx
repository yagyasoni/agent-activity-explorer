import { ListClock } from 'lucide-react'
import s from './AppHeader.module.css'

export function AppHeader() {
  return (
    <div className={s.root}>
      <div className={s.brand}>
        <span className={s.logo} aria-hidden="true">
          <ListClock size={16} />
        </span>
        <h1 className={s.title}>Agent Activity Explorer</h1>
      </div>
    </div>
  )
}

