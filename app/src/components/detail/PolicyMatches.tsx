import s from './PolicyMatches.module.css'

export function PolicyMatches({ matches }: { matches: string[] }) {
  if (matches.length === 0) {
    return <p className={s.none}>No policy rules fired.</p>
  }
  return (
    <ul className={s.list} aria-label="Policy rules that fired">
      {matches.map((rule) => (
        <li key={rule} className={s.chip}>
          <code>{rule}</code>
        </li>
      ))}
    </ul>
  )
}
