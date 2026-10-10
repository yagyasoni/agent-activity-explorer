import { AppShell } from './components/layout/AppShell'
import { AppHeader } from './components/layout/AppHeader'
import { FilterBar } from './components/filters/FilterBar'
import { EventTable } from './components/events/EventTable'
import { DetailPanel } from './components/detail/DetailPanel'
import { Button } from './components/ui/Button'
import { useEventFilters } from './hooks/useEventFilters'
import { useAgents } from './hooks/useAgents'
import { useEvents } from './hooks/useEvents'
import { useSelectedEvent } from './hooks/useSelectedEvent'
import { useEventDetail } from './hooks/useEventDetail'

export default function App() {
  const { filters, patch, clear, isActive } = useEventFilters()
  const agents = useAgents()
  const list = useEvents(filters)
  const { selectedId, select, close } = useSelectedEvent()
  const detail = useEventDetail(selectedId)

  return (
    <AppShell
      header={<AppHeader />}
      toolbar={
        <FilterBar
          filters={filters}
          agents={agents}
          isActive={isActive}
          onChange={patch}
          onClear={clear}
        />
      }
      panel={
        selectedId ? <DetailPanel eventId={selectedId} state={detail} onClose={close} /> : null
      }
      onPanelDismiss={close}
    >
      <EventTable
        state={list}
        selectedId={selectedId}
        onSelect={select}
        emptyAction={
          isActive ? (
            <Button variant="primary" onClick={clear}>
              Clear filters
            </Button>
          ) : undefined
        }
      />
    </AppShell>
  )
}
