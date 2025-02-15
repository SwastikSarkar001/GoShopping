import Navbar from "../Features/Navbar"
import { useEffect, useState } from "react"
import details from "../Features/FeatureDetails"
import FeaturesAccordion from "./FeaturesAccordion"
import PlanSummary from "./PlanSummary"
import GoToTop from "../Utilities/GoToTop"
import Footer from "../Utilities/Footer"

export default function Pricing() {
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

  useEffect(() => {
    document.title = 'Plans and Pricing | eazzyBizz'
  }, [])

  const [checkedFeatures, setCheckedFeatures] = useState (
    details.map(detail => detail.featureID).reduce((acc, id) => {
      acc[id] = false
      return acc
    }, {} as { [key: string]: boolean })
  )

  const selectFeatures = (key: string) => {
    setCheckedFeatures((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }))
  }

  return (
    <main className="min-h-screen flex flex-col items-stretch gap-8">
      <Navbar />
      <FeaturesAccordion checkedFeatures={checkedFeatures} selectFeatures={selectFeatures} />
      <PlanSummary checkedFeatures={checkedFeatures} />
      <GoToTop scrolled={scrolled} />
      <Footer />
    </main>
  )
}

