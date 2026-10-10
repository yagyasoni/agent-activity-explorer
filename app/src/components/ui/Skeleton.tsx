import type { CSSProperties } from 'react'
import s from './Skeleton.module.css'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
}

export function Skeleton({ width = '100%', height = 12 }: SkeletonProps) {
  return <span className={s.skeleton} style={{ width, height }} aria-hidden="true" />
}
