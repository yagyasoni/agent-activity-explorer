import { Skeleton } from '../ui/Skeleton'

interface SkeletonRowsProps {
  count?: number
  widths: Array<string | number>
}

export function SkeletonRows({ count = 12, widths }: SkeletonRowsProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <tr key={i} aria-hidden="true">
          {widths.map((w, j) => (
            <td key={j}>
              <Skeleton width={w} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
