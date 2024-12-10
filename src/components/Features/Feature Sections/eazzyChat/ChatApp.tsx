import { useEffect, useRef, useState } from "react"

import Navbar from "../../Navbar"
import HeroSection from "./HeroSection"
import AppFeatures from "./AppFeatures"
import FAQs from "./FAQs"
// import CTA from "./CTA"
import Footer from "../../../Utilities/Footer"
import { useAnimation } from "framer-motion";
import useTheme from "../../../../contexts/useTheme";
// import { useNavigate } from 'react-router-dom'

export default function ChatApp() {
  // useEffect(() => {
  //   window.location.href = 'https://www.google.com/'
  // })
  const [scrolled, setScrolled] = useState(false)
  const handleScroll = () => {
    const scrollThreshold = window.innerHeight * 0.15; // 15% of viewport height
    if (window.scrollY > scrollThreshold) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }
  
  window.onscroll = handleScroll
  const { theme } = useTheme()
  const ref = useRef<HTMLDivElement>(null)
  /* For filling background */
	const controls = useAnimation();
	useEffect(() => {
		controls.start({
			borderBottomWidth: scrolled ? '2px' : '0px',
			backgroundColor: (theme === 'dark') ? scrolled ? '#030711ff' : '#03071100' : scrolled ? '#fcf8eeff' : '#03071100',
			transition: { duration: 0.2 },
		});
	}, [scrolled, controls, theme])
  return (
    <main className="min-h-screen flex flex-col items-stretch [&>:nth-last-child(2)]:mb-auto [&>:first-child]:fixed">
      <Navbar ref={ref} animate={controls} />
      <HeroSection />
      <AppFeatures />
      <FAQs />
      {/* <CTA /> */}
      <Footer />
    </main>
  )
}
