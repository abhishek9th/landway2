import { useState, type ReactNode, type MouseEvent } from 'react'

type Variant = 'accent' | 'dark' | 'ghost' | 'white' | 'outline-light'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

const VARIANT_CLASS: Record<Variant, string> = {
  accent: 'btn-primary',
  dark: 'btn-dark',
  ghost: 'btn-ghost',
  white: 'btn-white',
  'outline-light': 'btn-outline-light',
}

interface Props {
  children: ReactNode
  variant?: Variant
  /** Render as an anchor (real navigation / tel links) instead of a button. */
  href?: string
  onClick?: (e: MouseEvent<HTMLElement>) => void
  className?: string
  ariaLabel?: string
}

/**
 * Shared CTA button with a material-style ripple on click. Renders as <a> when
 * `href` is provided (used for tel: links and cross-app navigation).
 */
export default function Button({
  children,
  variant = 'accent',
  href,
  onClick,
  className = '',
  ariaLabel,
}: Props) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const spawnRipple = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const ripple: Ripple = {
      id: Date.now(),
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    }
    setRipples((prev) => [...prev, ripple])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
    }, 600)
  }

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    spawnRipple(e)
    onClick?.(e)
  }

  const cls = `group ${VARIANT_CLASS[variant]} ${className}`
  const rippleNodes = ripples.map((r) => (
    <span
      key={r.id}
      className="pointer-events-none absolute rounded-full bg-white/40 animate-[ripple_0.6s_ease-out]"
      style={{
        left: r.x,
        top: r.y,
        width: r.size,
        height: r.size,
        animation: 'ripple 0.6s ease-out forwards',
      }}
    />
  ))

  if (href) {
    return (
      <a href={href} onClick={handleClick} className={cls} aria-label={ariaLabel}>
        {rippleNodes}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </a>
    )
  }

  return (
    <button onClick={handleClick} className={cls} aria-label={ariaLabel}>
      {rippleNodes}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
}
