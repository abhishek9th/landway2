import { motion } from 'framer-motion'
import { FiArrowUpRight, FiMapPin } from 'react-icons/fi'
import type { Project } from '../data/projects'
import { fadeUp } from '../lib/motion'

/**
 * Premium 16:9 property card. The whole card is a single clickable anchor that
 * navigates to the project's existing app at `/{slug}` (real page load — the
 * project pages are separate builds served under the same domain).
 */
export default function ProjectCard({ project }: { project: Project }) {
  const { slug, name, location, status } = project
  const badge =
    status === 'ongoing'
      ? { label: 'Ongoing', className: 'bg-accent text-white' }
      : { label: 'Ready', className: 'bg-white/90 text-ink' }

  return (
    <motion.a
      variants={fadeUp}
      href={`/${slug}`}
      aria-label={`${name} — view project`}
      className="group relative block max-w-full overflow-hidden rounded-xl2 border border-line bg-card shadow-soft transition-all duration-500 ease-luxe hover:-translate-y-2 hover:shadow-lift [@media(hover:none)]:hover:translate-y-0"
    >
      {/* 16:9 image frame */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={project.image}
          alt={name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-luxe group-hover:scale-110"
        />

        {/* Gradient overlay — deepens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-accent/0 transition-colors duration-500 group-hover:bg-accent/10" />

        {/* Status badge */}
        <span
          className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-soft backdrop-blur ${badge.className}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {badge.label}
        </span>

        {/* Arrow icon */}
        <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-500 ease-luxe group-hover:bg-accent group-hover:text-white">
          <FiArrowUpRight className="h-5 w-5 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>

        {/* Bottom caption */}
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-white/75">
            <FiMapPin className="h-3.5 w-3.5 text-accent" />
            {location}
          </p>
        </div>
      </div>
    </motion.a>
  )
}
