import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'up' | 'left' | 'right' | 'scale' | 'fade'

const OFFSETS: Record<Variant, { x?: number; y?: number; scale?: number }> = {
  up: { y: 40 },
  left: { x: -50 },
  right: { x: 50 },
  scale: { scale: 0.92 },
  fade: {},
}

interface Props {
  children: ReactNode
  variant?: Variant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  as?: 'div' | 'li' | 'span'
}

export default function Reveal({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.8,
  className,
  once = true,
  as = 'div',
}: Props) {
  const off = OFFSETS[variant]
  const M = motion[as]
  return (
    <M
      initial={{ opacity: 0, ...off }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </M>
  )
}
