import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPhone, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi'
import { DEVELOPER_BRAND } from '../data/developer'

const WEBHOOK_URL = import.meta.env.VITE_API_URL ??
  'https://script.google.com/macros/s/AKfycbyP0I4FiBqfs1tKNmCgz7pSdgGcQBRRT3ygQtLC-01yIsSuh2CxRGI7MpVWq0LSNggm/exec'

type Toast = { type: 'success' | 'error'; msg: string } | null

/**
 * Which page of the main site a lead came from. Project pages send their own
 * project name (from their BRAND data); this is the corporate-site equivalent
 * so every row in the sheet says where the enquiry originated.
 */
function pageName(pathname: string) {
  if (pathname.startsWith('/about')) return 'Landway Innovation — About Us page'
  return 'Landway Innovation — Main Website'
}

export default function CtaForm() {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4500)
    return () => clearTimeout(t)
  }, [toast])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    const name = form.name.trim()
    const phone = form.phone.trim()

    if (!/^[A-Za-z][A-Za-z ]*$/.test(name) || name.replace(/ /g, '').length < 2) {
      setToast({ type: 'error', msg: 'Please enter a valid name (letters only).' })
      return
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setToast({ type: 'error', msg: 'Please enter a valid 10-digit mobile number.' })
      return
    }

    setLoading(true)
    setToast(null)
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name,
          phone,
          project: pageName(pathname),
          page: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)

      setForm({ name: '', phone: '' })
      setSubmitted(true)
    } catch {
      setToast({ type: 'error', msg: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="connect" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,rgba(230,57,70,0.18),transparent_70%)]" />

      <div className="shell relative flex justify-center">
        <div className="w-full max-w-md text-center">
          <span className="eyebrow justify-center text-white/70">
            {DEVELOPER_BRAND.developerShort}
          </span>
          <h2 className="h-display mt-4 text-white text-[clamp(2.25rem,6vw,4rem)]">
            Connect With Us
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-white/65">
            Leave your details and our team will call you back with everything you need
            to know about Landway Innovation.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-9 rounded-3xl border border-white/10 bg-white/10 px-8 py-12 text-left"
            >
              <div className="flex items-center justify-center">
                <FiCheckCircle className="h-12 w-12 text-accent" />
              </div>
              <h3 className="mt-8 text-center text-3xl font-bold text-white">
                Thank you for contacting us!
              </h3>
              <p className="mt-4 text-center text-white/75">
                We’ll reach out to you shortly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="mt-9 space-y-4 text-left">
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  required
                  aria-label="Name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value.replace(/[^A-Za-z ]/g, '') }))
                  }
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-white/40 focus:border-accent/70 focus:ring-4 focus:ring-accent/10"
                />
              </div>
              <div className="relative">
                <FiPhone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  aria-label="Phone number"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))
                  }
                  className="w-full rounded-xl border border-white/15 bg-white/[0.06] py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-white/40 focus:border-accent/70 focus:ring-4 focus:ring-accent/10"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending…' : 'Request a Callback'}
              </button>
            </form>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-[110] flex max-w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 items-start gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-lift ${
              toast.type === 'success' ? 'bg-white text-ink' : 'bg-accent text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <FiCheckCircle className="h-5 w-5 text-accent" />
            ) : (
              <FiAlertCircle className="h-5 w-5" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
