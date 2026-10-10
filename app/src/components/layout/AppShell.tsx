import type { ReactNode } from 'react'
import s from './AppShell.module.css'

interface AppShellProps {
  header: ReactNode
  toolbar: ReactNode
  panel: ReactNode | null
  onPanelDismiss?: () => void
  children: ReactNode
}

export function AppShell({ header, toolbar, panel, onPanelDismiss, children }: AppShellProps) {
  const panelOpen = panel !== null

  return (
    <div className={s.shell}>
      <header className={s.header}>{header}</header>
      <div className={s.toolbar}>{toolbar}</div>
      <div className={s.body} data-panel-open={panelOpen}>
        <main className={s.main}>{children}</main>
        {panelOpen && (
          <>
            <div className={s.backdrop} onClick={onPanelDismiss} aria-hidden="true" />
            <aside className={s.panel}>{panel}</aside>
          </>
        )}
      </div>
    </div>
  )
}
