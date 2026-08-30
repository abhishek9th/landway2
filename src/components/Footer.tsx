import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiArrowUpRight } from 'react-icons/fi'
import { CONTACT, NAV_LINKS } from '../data/projects'
import { fadeUp, viewportOnce } from '../lib/motion'
import Button from './Button'

export default function Footer() {
  const { pathname } = useLocation()
  const navHref = (href: string) => (pathname === '/' ? href : `/${href}`)
  return (
    <footer id="contact" className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,rgba(230,57,70,0.14),transparent_70%)]" />

      {/* CTA band */}
      <div className="shell relative border-b border-white/10 py-16 text-center sm:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl"
        >
          <span className="eyebrow justify-center !text-accent [&::before]:bg-accent/50">
            Get In Touch
          </span>
          <h2 className="h-display mt-4 text-white text-[clamp(2rem,4.5vw,3.5rem)]">
            Let's find your next address
          </h2>
          <p className="mt-4 text-white/70">
            Speak with our team about availability, pricing, and site visits.
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <Button href={`tel:${CONTACT.tel}`} variant="accent">
              <FiPhone className="h-4 w-4" />
              Call {CONTACT.label}
            </Button>
            <Button href={navHref('#projects')} variant="outline-light">
              Explore Projects
              <FiArrowUpRight className="h-4 w-4 arrow-slide" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Lower footer */}
      <div className="shell relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <img
            src="/logo.png"
            alt="Landway Innovation"
            className="h-14 w-auto"
            width={576}
            height={433}
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Building better communities across Lucknow — premium residential projects designed for
            modern living.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Explore</h4>
          <ul className="mt-4 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={navHref(l.href)} className="text-sm text-white/75 transition-colors hover:text-accent">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Contact</h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <li>
              <a href={`tel:${CONTACT.tel}`} className="flex items-center gap-2 transition-colors hover:text-accent">
                <FiPhone className="h-4 w-4 text-accent" />
                {CONTACT.label}
              </a>
            </li>
            <li>
              <a href="mailto:info@landwayinnovation.in" className="flex items-center gap-2 transition-colors hover:text-accent">
                <FiMail className="h-4 w-4 text-accent" />
                info@landwayinnovation.in
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="h-4 w-4 text-accent" />
              Lucknow, Uttar Pradesh
            </li>
          </ul>
        </div>
      </div>

      <div className="shell relative flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/50">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p>© {new Date().getFullYear()} Landway Innovation India Pvt. Ltd. All rights reserved.</p>
          <p>Crafted for modern living.</p>
        </div>
        <p className="max-w-4xl text-center leading-relaxed text-white/40 sm:text-left">
          All the images are computer generated and are for illustrative purposes only. Actual
          product, property, specifications, finishes, colors, dimensions, and features may vary.
        </p>
      </div>
    </footer>
  )
}
