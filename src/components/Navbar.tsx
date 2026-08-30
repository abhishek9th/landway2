import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPhone, FiMenu, FiX } from 'react-icons/fi'
import { NAV_LINKS, CONTACT } from '../data/projects'
import Button from './Button'

/** Left-side brand lockup (company wordmark). */
function Logo() {
  const { pathname } = useLocation()
  return (
    <a
      href={pathname === '/' ? '#home' : '/'}
      className="flex items-center"
      aria-label="Landway Innovation — home"
    >
      <img
        src="/logo.png"
        alt="Landway Innovation"
        className="h-10 w-auto sm:h-11"
        width={576}
        height={433}
      />
    </a>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navHref = (href: string) => (pathname === '/' ? href : `/${href}`)
  const barScrolled = pathname === '/' ? scrolled : true

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`transition-all duration-500 ease-luxe ${
          barScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-line shadow-soft'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="shell flex items-center justify-between gap-3 py-3 sm:py-4">
          <Logo />

          {/* Center links (desktop) */}
          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={navHref(l.href)}
                  className={`group relative text-sm font-medium transition-colors ${
                    barScrolled ? 'text-text hover:text-accent-dark' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-accent transition-all duration-500 ease-luxe group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Right CTA (desktop) */}
          <div className="hidden lg:block">
            <Button
              href={`tel:${CONTACT.tel}`}
              variant={barScrolled ? 'accent' : 'white'}
              ariaLabel="Call Landway Innovation now"
              className="!w-auto"
            >
              <FiPhone className="h-4 w-4" />
              Call Now
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors lg:hidden ${
              barScrolled ? 'text-ink hover:bg-ink/5' : 'text-white hover:bg-white/10'
            }`}
          >
            {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="shell lg:hidden"
          >
            <div className="glass mt-2 rounded-xl2 p-6 shadow-lift">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={navHref(l.href)}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-accent/10 hover:text-accent-dark"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Button
                href={`tel:${CONTACT.tel}`}
                variant="accent"
                className="mt-4 w-full"
                ariaLabel="Call Landway Innovation now"
              >
                <FiPhone className="h-4 w-4" />
                Call Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
