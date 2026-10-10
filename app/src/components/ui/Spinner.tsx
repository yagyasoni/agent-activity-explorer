import { LoaderCircle } from 'lucide-react'
import s from './Spinner.module.css'

export function Spinner({ size = 16 }: { size?: number }) {
  return <LoaderCircle className={s.spinner} size={size} aria-hidden="true" />
}
