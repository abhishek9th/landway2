import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiPhone } from 'react-icons/fi'
import { CONTACT } from '../data/projects'
import { stagger, fadeUp } from '../lib/motion'
import Button from './Button'
import ScrollIndicator from './ScrollIndicator'

const HERO_VIDEO = '/hero.mov'
const HERO_POSTER = '/hero-landing.png'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  return (
    <section id="home" className="relative h-[100svh] min-h-[560px] w-full max-w-[100vw] overflow-hidden sm:min-h-[640px]">
      {/* Background video */}
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        poster={HERO_POSTER}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Subtle black overlay + gradient for text legibility */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />

      {/* Content */}
      <div className="shell relative z-10 flex h-full flex-col justify-center pb-20 pt-24">
        <motion.div
          variants={stagger(0.14, 0.2)}
          initial="hidden"
          animate="show"
          className="w-full max-w-3xl"
        >
          <motion.span
            variants={fadeUp}
            className="eyebrow !text-accent [&::before]:bg-accent/60"
          >
            Landway Innovation
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-display font-extrabold leading-[1.05] tracking-[-0.03em] text-white text-[clamp(2.25rem,8vw,5.5rem)] text-balance sm:mt-5"
          >
            Building Better
            <br />
            <span className="text-accent">Communities</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-xl"
          >
            Premium Residential Projects Designed For Modern Living
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Button href="#projects" variant="accent">
              Explore Projects
              <FiArrowRight className="h-4 w-4 arrow-slide" />
            </Button>
            <Button href={`tel:${CONTACT.tel}`} variant="outline-light">
              <FiPhone className="h-4 w-4" />
              Call Now
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  )
}
