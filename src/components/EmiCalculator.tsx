import { useMemo, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { fadeUp, viewportOnce } from '../lib/motion'

const AMOUNT_MIN = 500_000 // ₹5 Lakh
const AMOUNT_MAX = 7_000_000 // ₹70 Lakh
const AMOUNT_STEP = 50_000

const RATE_MIN = 5
const RATE_MAX = 15
const RATE_STEP = 0.05

const TENURE_MIN = 1
const TENURE_MAX = 30
const TENURE_STEP = 1

function formatINR(value: number, fraction = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction,
  }).format(value)
}

function formatLac(value: number) {
  const lac = value / 100_000
  return lac % 1 === 0 ? `${lac} L` : `${lac.toFixed(1)} L`
}

function calcEmi(principal: number, annualRate: number, years: number) {
  if (principal <= 0 || years <= 0) return 0
  if (annualRate <= 0) return principal / (years * 12)
  const r = annualRate / 12 / 100
  const n = years * 12
  const factor = Math.pow(1 + r, n)
  return (principal * r * factor) / (factor - 1)
}

function SliderRow({
  label,
  valueLabel,
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string
  valueLabel: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
  minLabel: string
  maxLabel: string
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <span className="text-xs font-semibold uppercase tracking-luxe text-muted">{label}</span>
        <span className="break-words font-display text-lg font-extrabold text-ink sm:text-2xl">
          {valueLabel}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="emi-slider w-full"
        style={{ '--emi-pct': `${pct}%` } as CSSProperties}
      />
      <div className="flex justify-between text-[11px] font-medium text-muted/80">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}

export default function EmiCalculator() {
  const [amount, setAmount] = useState(3_500_000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)

  const emi = useMemo(() => calcEmi(amount, rate, tenure), [amount, rate, tenure])
  const totalPayable = emi * tenure * 12
  const totalInterest = Math.max(0, totalPayable - amount)

  return (
    <section id="emi-calculator" className="relative overflow-x-hidden py-16 sm:py-24 lg:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Plan Your Budget"
          title="Monthly EMI calculator"
          subtitle="Slide the loan amount, interest rate, and tenure to see what you'll pay each month."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="glass mx-auto max-w-3xl overflow-hidden rounded-xl3 p-6 shadow-soft sm:p-10"
        >
          <div className="space-y-10">
            <SliderRow
              label="Loan amount"
              valueLabel={formatINR(amount)}
              min={AMOUNT_MIN}
              max={AMOUNT_MAX}
              step={AMOUNT_STEP}
              value={amount}
              onChange={setAmount}
              minLabel={formatLac(AMOUNT_MIN)}
              maxLabel={formatLac(AMOUNT_MAX)}
            />

            <SliderRow
              label="Rate of interest"
              valueLabel={`${rate.toFixed(2)}% p.a.`}
              min={RATE_MIN}
              max={RATE_MAX}
              step={RATE_STEP}
              value={rate}
              onChange={setRate}
              minLabel={`${RATE_MIN}%`}
              maxLabel={`${RATE_MAX}%`}
            />

            <SliderRow
              label="Tenure"
              valueLabel={`${tenure} ${tenure === 1 ? 'year' : 'years'}`}
              min={TENURE_MIN}
              max={TENURE_MAX}
              step={TENURE_STEP}
              value={tenure}
              onChange={setTenure}
              minLabel={`${TENURE_MIN} yr`}
              maxLabel={`${TENURE_MAX} yrs`}
            />
          </div>

          <div className="mt-12 border-t border-line pt-8">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-luxe text-muted">
                  Monthly EMI
                </p>
                <p className="mt-2 font-display text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] text-accent">
                  {formatINR(Math.round(emi))}
                </p>
              </div>
              <div className="mt-4 grid w-full grid-cols-2 gap-4 sm:mt-0 sm:w-auto sm:gap-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Total interest
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-ink">
                    {formatINR(Math.round(totalInterest))}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Total payable
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-ink">
                    {formatINR(Math.round(totalPayable))}
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-xs leading-relaxed text-muted sm:text-left">
              Indicative only. Actual EMI may vary by bank, processing fees, and eligibility.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
