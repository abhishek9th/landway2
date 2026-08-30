import { motion } from 'framer-motion'

/** Animated mouse scroll indicator anchored to the bottom-center of the hero. */
export default function ScrollIndicator() {
  return (
    <motion.a
      href="#projects"
      aria-label="Scroll to projects"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 text-white/80 sm:bottom-8"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
      <span className="flex h-10 w-6 items-start justify-center rounded-full border border-white/50 p-1.5">
        <span className="h-2 w-1 rounded-full bg-white animate-scroll-wheel" />
      </span>
    </motion.a>
  )
}
