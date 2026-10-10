import { Search, X } from 'lucide-react'
import s from './SearchInput.module.css'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search agent, tool or args…',
}: SearchInputProps) {
  return (
    <div className={s.root}>
      <Search size={16} className={s.icon} />
      <input
        type="search"
        className={s.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search events"
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          className={s.clear}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
