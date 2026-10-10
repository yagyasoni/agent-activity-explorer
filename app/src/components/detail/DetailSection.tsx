import { useId, type ReactNode } from 'react'
import s from './DetailSection.module.css'

interface DetailSectionProps {
  title: string
  action?: ReactNode
  children: ReactNode
}

export function DetailSection({ title, action, children }: DetailSectionProps) {
  const id = useId()
  return (
    <section className={s.section} aria-labelledby={id}>
      <header className={s.header}>
        <h3 id={id} className={s.title}>
          {title}
        </h3>
        {action}
      </header>
      {children}
    </section>
  )
}
