import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import ProjectCard from './ProjectCard'
import { ONGOING_PROJECTS, COMPLETED_PROJECTS, type Project } from '../data/projects'
import { stagger, viewportOnce } from '../lib/motion'

/** One labeled group (Ongoing / Completed) rendered as a staggered 16:9 grid. */
function ProjectGroup({
  eyebrow,
  title,
  projects,
}: {
  eyebrow: string
  title: string
  projects: Project[]
}) {
  return (
    <div className="mt-16 first:mt-0">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger(0.06)}
      >
        <div className="mb-8 flex flex-col items-start gap-2">
          <span className="eyebrow">{eyebrow}</span>
          <h3 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {title}
          </h3>
        </div>

        <motion.div
          variants={stagger(0.08)}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative overflow-x-hidden py-16 sm:py-24 lg:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="Our Portfolio"
          title="Explore Our Projects"
          subtitle="Find your perfect home across our premium developments."
        />

        <ProjectGroup
          eyebrow="Under Construction"
          title="Ongoing Projects"
          projects={ONGOING_PROJECTS}
        />
        <ProjectGroup
          eyebrow="Ready To Move"
          title="Completed Projects"
          projects={COMPLETED_PROJECTS}
        />
      </div>
    </section>
  )
}
