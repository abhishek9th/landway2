export type ProjectStatus = 'ongoing' | 'completed'

export interface Project {
  /** URL slug — matches the existing project app served at this subpath. */
  slug: string
  name: string
  location: string
  status: ProjectStatus
  /** Same image used as the project page hero background. */
  image: string
}

/** Project hero image path as served under home at /{slug}/hero-kalp.jpeg */
const hero = (slug: string) => `/${slug}/hero-kalp.jpeg`

export const ONGOING_PROJECTS: Project[] = [
  { slug: 'bhagwanti-enclave', name: 'Bhagwati Enclave', location: 'Lucknow, Uttar Pradesh', status: 'ongoing', image: hero('bhagwanti-enclave') },
  { slug: 'kishkindha-enclave', name: 'Kishkindha Enclave', location: 'Lucknow, Uttar Pradesh', status: 'ongoing', image: hero('kishkindha-enclave') },
  { slug: 'sharda-enclave', name: 'Sharda Enclave', location: 'Lucknow, Uttar Pradesh', status: 'ongoing', image: hero('sharda-enclave') },
  { slug: 'lakshya-avenue', name: 'Lakshya Avenue', location: 'Lucknow, Uttar Pradesh', status: 'ongoing', image: hero('lakshya-avenue') },
  { slug: 'landway-14', name: 'Colonel Enclave', location: 'Lucknow, Uttar Pradesh', status: 'ongoing', image: hero('landway-14') },
]

export const COMPLETED_PROJECTS: Project[] = [
  { slug: 'atal-vilas', name: 'Atal Vilas', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('atal-vilas') },
  { slug: 'kalp-residency', name: 'Kalp Residency', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('kalp-residency') },
  { slug: 'manipal-delight', name: 'Manipal Delight', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('manipal-delight') },
  { slug: 'manipal-avenue', name: 'Manipal Avenue', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('manipal-avenue') },
  { slug: 'saraswati-enclave', name: 'Saraswati Enclave', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('saraswati-enclave') },
  { slug: 'indraprastha-residency', name: 'Indraprastha Residency', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('indraprastha-residency') },
  { slug: 'sankalp-plaza', name: 'Sankalp Plaza', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('sankalp-plaza') },
  { slug: 'neelkanth-enclave', name: 'Neelkanth Enclave', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('neelkanth-enclave') },
  { slug: 'swastik-enclave', name: 'Swastik Enclave', location: 'Lucknow, Uttar Pradesh', status: 'completed', image: hero('swastik-enclave') },
]

/** Phone number for the "Call Now" CTAs. Replace with the real number. */
export const CONTACT = {
  tel: '+917497950070',
  label: '+91 74979 50070',
}

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'EMI', href: '#emi-calculator' },
  { label: 'Contact', href: '#contact' },
]
