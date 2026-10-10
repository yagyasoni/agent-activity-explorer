import { formatJson } from '../../lib/format'
import s from './JsonBlock.module.css'

interface JsonBlockProps {
  value: unknown
  label: string
}

export function JsonBlock({ value, label }: JsonBlockProps) {
  return (
    <pre className={s.pre} tabIndex={0} aria-label={label}>
      <code>{formatJson(value)}</code>
    </pre>
  )
}
