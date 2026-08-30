import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Developer from '../components/Developer'
import CtaForm from '../components/CtaForm'

export default function AboutUs() {
  useEffect(() => {
    document.title = 'About Us — Landway Innovation'
    window.scrollTo(0, 0)
    return () => {
      document.title =
        'Landway Innovation — Building Better Communities | Premium Residential Projects'
    }
  }, [])

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden pt-20 sm:pt-24">
        <Developer />
        <CtaForm />
      </main>
      <Footer />
    </>
  )
}
