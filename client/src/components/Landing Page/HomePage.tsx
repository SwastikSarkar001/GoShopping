import { useState, useRef, useEffect } from "react"

import Navbar from "./Navbar"
import GoToTop from "../Utilities/GoToTop"
import Footer from "../Utilities/Footer"
import sectionsInfo from "./sectiondata"
import NavHeightProvider from "../../contexts/NavHeightProvider"

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const handleScroll = () => {
    const scrollThreshold = window.innerHeight * 0.15; // 15% of viewport height
    if (window.scrollY > scrollThreshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }

  const refs: React.RefObject<HTMLDivElement>[] = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null)
  ]

	window.onscroll = handleScroll

  useEffect(() => {
    document.title = 'Welcome to eazzyBizz!'
  }, [])

  return (
    <main className="relative">
      <Navbar scrolled={scrolled} sectionRefs={refs} />
      <NavHeightProvider>
        {
          sectionsInfo.map((section, index) => {
            return <section.sectionComponent key={index} ref={refs[index]} />
          })
        }
      </NavHeightProvider>
      <GoToTop scrolled={scrolled} />
      <Footer />
    </main>
  )
}