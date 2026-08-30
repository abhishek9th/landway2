/**
 * Fixed, non-interactive premium background: very light radial gradients, a few
 * soft floating blurred circles, and a faint noise texture. Sits behind all
 * page content. Nothing flashy — pure atmosphere.
 */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Light radial washes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(230,57,70,0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(196,45,57,0.06),transparent_60%)]" />

      {/* Soft floating blurred circles */}
      <div className="absolute -left-40 top-1/4 hidden h-[34rem] w-[34rem] rounded-full bg-accent/10 blur-3xl animate-float-slow sm:block" />
      <div
        className="absolute -right-40 top-2/3 hidden h-[28rem] w-[28rem] rounded-full bg-accent-dark/10 blur-3xl animate-float-slow sm:block"
        style={{ animationDelay: '-6s' }}
      />

      {/* Faint film grain */}
      <div className="noise absolute inset-0 opacity-[0.035]" />
    </div>
  )
}
