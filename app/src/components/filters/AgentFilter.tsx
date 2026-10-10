import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { AgentsState } from '../../types/state'
import { ChevronDown } from 'lucide-react'
import { Skeleton } from '../ui/Skeleton'
import { ErrorState } from '../states/ErrorState'
import s from './AgentFilter.module.css'

interface AgentFilterProps {
  agents: AgentsState
  selected: string[]
  onChange: (selected: string[]) => void
}

export function AgentFilter({ agents, selected, onChange }: AgentFilterProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      setOpen(false)
    }
  }

  const toggle = (agent: string) => {
    onChange(
      selected.includes(agent) ? selected.filter((a) => a !== agent) : [...selected, agent],
    )
  }

  return (
    <div className={s.root} ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        className={s.trigger}
        data-active={selected.length > 0}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>Agent</span>
        {selected.length > 0 && <span className={s.count}>{selected.length}</span>}
        <ChevronDown size={14} className={s.chevron} />
      </button>

      {open && (
        <div className={s.popover} role="group" aria-label="Filter by agent">
          <div className={s.popoverHeader}>
            <span className={s.popoverTitle}>Agents</span>
            {selected.length > 0 && (
              <button type="button" className={s.link} onClick={() => onChange([])}>
                Clear
              </button>
            )}
          </div>

          <div className={s.list}>
            {agents.status === 'loading' && (
              <div className={s.skeletons} aria-busy="true" aria-label="Loading agents">
                <Skeleton width="70%" />
                <Skeleton width="55%" />
                <Skeleton width="80%" />
                <Skeleton width="60%" />
              </div>
            )}

            {agents.status === 'error' && (
              <ErrorState
                compact
                title="Couldn't load agents"
                error={agents.error}
                onRetry={agents.retry}
              />
            )}

            {agents.status === 'ready' && agents.items.length === 0 && (
              <p className={s.empty}>No agents yet</p>
            )}

            {agents.status === 'ready' &&
              agents.items.map((agent) => (
                <label key={agent} className={s.option}>
                  <input
                    type="checkbox"
                    className={s.checkbox}
                    checked={selected.includes(agent)}
                    onChange={() => toggle(agent)}
                  />
                  <span className={s.optionLabel}>{agent}</span>
                </label>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
