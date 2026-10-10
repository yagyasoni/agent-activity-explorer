import type { EventFilters } from '../../types/events'
import type { AgentsState } from '../../types/state'
import { Button } from '../ui/Button'
import { X } from 'lucide-react'
import { SearchInput } from './SearchInput'
import { AgentFilter } from './AgentFilter'
import { StatusFilter } from './StatusFilter'
import s from './FilterBar.module.css'

interface FilterBarProps {
  filters: EventFilters
  agents: AgentsState
  isActive: boolean
  onChange: (changes: Partial<EventFilters>) => void
  onClear: () => void
}

export function FilterBar({ filters, agents, isActive, onChange, onClear }: FilterBarProps) {
  return (
    <form className={s.bar} role="search" onSubmit={(e) => e.preventDefault()}>
      <div className={s.search}>
        <SearchInput value={filters.q} onChange={(q) => onChange({ q })} />
      </div>

      <AgentFilter
        agents={agents}
        selected={filters.agents}
        onChange={(selected) => onChange({ agents: selected })}
      />

      <StatusFilter value={filters.status} onChange={(status) => onChange({ status })} />

      {isActive && (
        <Button variant="ghost" size="md" onClick={onClear} className={s.clear}>
          <X size={14} />
          Clear filters
        </Button>
      )}
    </form>
  )
}
