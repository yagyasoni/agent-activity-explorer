const dateTime = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${dateTime.format(d)}.${ms}`
}

export function formatLatency(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}

export type LatencyLevel = 'normal' | 'slow' | 'very-slow'

export function latencyLevel(ms: number): LatencyLevel {
  if (ms >= 3000) return 'very-slow'
  if (ms >= 1000) return 'slow'
  return 'normal'
}

const integer = new Intl.NumberFormat()

export function formatCount(n: number): string {
  return integer.format(n)
}

export function formatJson(value: unknown): string {
  if (value === undefined) return '—'
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}
