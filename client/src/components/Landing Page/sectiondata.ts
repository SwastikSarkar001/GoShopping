import { lazy } from 'react'

const VideoSection = lazy(() => import('./VideoSection'))
const AboutUs = lazy(() => import('./AboutUs'))
// const TrustedBrands = lazy(() => import('./TrustedBrands'))
const ContactUs = lazy(() => import('./ContactUs'))
import { sectionsInfoType } from "../../types"

/** IMPORT ALL SECTIONS OF THE WEBSITE HERE ONLY! (EXCLUDING NAVBAR AND OTHER FUNCTIONAL COMPONENTS) */
const sectionsInfo: sectionsInfoType = [{
    name: 'Home',
    sectionComponent: VideoSection
  }, {
    name: 'About Us',
    sectionComponent: AboutUs
  }, {
  //   name: 'Trusted Brands',
  //   sectionComponent: TrustedBrands
  // }, {
    name: 'Contact Us',
    sectionComponent: ContactUs
  }
]

export default sectionsInfo