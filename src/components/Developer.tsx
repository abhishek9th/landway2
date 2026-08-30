import { motion } from 'framer-motion'
import { FiEye, FiTarget } from 'react-icons/fi'
import Reveal from './Reveal'
import { DEVELOPER, DEVELOPER_BRAND, DEVELOPER_IMAGE } from '../data/developer'

export default function Developer() {
  return (
    <section id="developer" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_0%,rgba(230,57,70,0.14),transparent_70%)]" />
      <div className="shell relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <Reveal variant="left">
            <span className="eyebrow text-white/80">About the Developer</span>
            <h2 className="h-display mt-4 text-white text-[clamp(2rem,4vw,3.25rem)]">
              {DEVELOPER_BRAND.developer}
            </h2>
            <p className="mt-5 max-w-lg text-white/70">
              For over a decade, Landway Innovation has been crafting landmark residential
              and commercial developments across Uttar Pradesh — built on trust, quality
              and on-time delivery.
            </p>
          </Reveal>

          <div className="mt-8 space-y-5">
            {[
              { icon: FiEye, label: 'Vision', text: DEVELOPER.vision },
              { icon: FiTarget, label: 'Mission', text: DEVELOPER.mission },
            ].map((b, i) => (
              <Reveal key={b.label} variant="left" delay={0.1 + i * 0.1}>
                <div className="flex gap-4 rounded-xl2 border border-white/10 bg-white/[0.03] p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-white">{b.label}</h3>
                    <p className="mt-1 text-sm text-white/65">{b.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {DEVELOPER.stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="font-display text-3xl font-extrabold text-white">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-white/50">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Reveal variant="right">
          <div className="relative overflow-hidden rounded-xl3 shadow-lift">
            <img
              src={DEVELOPER_IMAGE}
              alt="Landway Innovation completed projects"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
