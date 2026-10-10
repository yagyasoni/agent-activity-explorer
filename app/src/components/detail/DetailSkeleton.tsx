import { Skeleton } from '../ui/Skeleton'
import s from './DetailSkeleton.module.css'

export function DetailSkeleton() {
  return (
    <div className={s.root} aria-hidden="true">
      <div className={s.grid}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={s.row}>
            <Skeleton width={64} />
            <Skeleton width={i % 2 ? '45%' : '70%'} />
          </div>
        ))}
      </div>
      <Skeleton width={110} height={10} />
      <Skeleton width="100%" height={120} />
      <Skeleton width={70} height={10} />
      <Skeleton width="100%" height={160} />
    </div>
  )
}
