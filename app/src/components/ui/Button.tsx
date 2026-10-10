import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './Spinner'
import s from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  loading?: boolean
  iconOnly?: boolean
  children: ReactNode
}

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  iconOnly = false,
  className,
  disabled,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [s.button, s[variant], s[size], iconOnly ? s.iconOnly : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <span className={s.spinner}>
          <Spinner size={14} />
        </span>
      )}
      <span className={loading ? s.hiddenLabel : s.label}>{children}</span>
    </button>
  )
}
