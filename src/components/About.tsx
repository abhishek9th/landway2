import { motion } from 'framer-motion'
import { FiHome, FiAward, FiUsers } from 'react-icons/fi'
import SectionHeading from './SectionHeading'
import { fadeUp, stagger, scaleIn, viewportOnce } from '../lib/motion'

const STATS = [
  { icon: FiHome, value: '10+', label: 'Landmark Projects' },
  { icon: FiUsers, value: '500+', label: 'Happy Families' },
  { icon: FiAward, value: '7+', label: 'Years of Trust' },
]

export default function About() {
  return (
    <section id="about" className="relative overflow-x-hidden py-16 sm:py-24 lg:py-32">
      <div className="shell">
        <div className="glass overflow-hidden rounded-xl3 p-5 shadow-soft sm:p-8 lg:p-14">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="About Landway"
                title="Crafting homes that stand the test of time"
                subtitle="Landway Innovation is a premium residential developer dedicated to building better communities — thoughtfully planned, beautifully built, and delivered on trust."
              />
            </div>

            <motion.div
              variants={stagger(0.12)}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {STATS.map(({ icon: Icon, value, label }) => (
                <motion.div
                  key={label}
                  variants={scaleIn}
                  className="card-base flex flex-col items-start gap-3 p-6 transition-all duration-500 ease-luxe hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accent/10 text-accent-dark">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl font-extrabold text-ink">{value}</span>
                  <span className="text-sm text-muted">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="lead mt-10 max-w-3xl"
          >
            From gated villa communities to premium plotted developments, every Landway address is
            designed for modern living — with wide roads, green open spaces, and construction quality
            that families can rely on for generations.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
