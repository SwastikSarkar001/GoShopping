import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import details from './FeatureDetails'
import GoToTop from '../Utilities/GoToTop'

export default function Feature() {
  const params = useParams<{ featureID: string }>()
  const detail = details.filter(detail => detail.featureID === params.featureID)[0]
  useEffect(() => {
    if (detail !== undefined) document.title = `${detail.title} | eazzyBizz`
    else throw new Error("Feature not found")
  }, [])

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
  
  return (
    <>
      <detail.sectionComponent />
      <GoToTop scrolled={scrolled} />
    </>
  )
}