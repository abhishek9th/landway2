import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'

/**
 * Homepage app shell. The homepage lives at "/". Each project has its own
 * standalone build served at "/{slug}" under the same domain, so those links
 * are real navigations (see ProjectCard) rather than client-side routes.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<Navigate to="/about-us" replace />} />
      <Route path="/about-us" element={<AboutUs />} />
    </Routes>
  )
}
