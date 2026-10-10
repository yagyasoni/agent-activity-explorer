import s from './states.module.css'

export function LoadingBar({ active }: { active: boolean }) {
  return (
    <div
      className={s.bar}
      data-active={active}
      role={active ? 'progressbar' : undefined}
      aria-label={active ? 'Refreshing' : undefined}
      aria-hidden={active ? undefined : true}
    />
  )
}
