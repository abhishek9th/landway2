import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProjectsSection from '../components/ProjectsSection'
import About from '../components/About'
import EmiCalculator from '../components/EmiCalculator'
import Footer from '../components/Footer'
import Background from '../components/Background'

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="overflow-x-hidden">
        <Hero />
        <ProjectsSection />
        <About />
        <EmiCalculator />
      </main>
      <Footer />
    </>
  )
}
