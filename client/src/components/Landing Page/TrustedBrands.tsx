import Gucci from "./logos/Brands/Gucci"
import LouisVuitton from "./logos/Brands/LouisVuitton"
import Zara from "./logos/Brands/Zara"
import Puma from "./logos/Brands/Puma"
import Adidas from "./logos/Brands/Adidas"
import Apple from "./logos/Brands/Apple"

import { motion } from "framer-motion"
import { forwardRef } from "react"
import { emptyProps } from "../../types"

export default forwardRef<HTMLDivElement, emptyProps>(function TrustedBrands(props, ref) {
  return (
    <section id='trusted' ref={ref} className="min-h-screen flex items-center justify-center flex-col text-text transition-colors gap-8 trusted-brand-section">
      <h1 className="section-header text-center px-8">Our Trusted Partners</h1>
      <div className="flex w-3/5 items-center justify-center gap-12 flex-wrap">
        <motion.div
          whileHover={{scale: 1.1}}
          transition={{type: 'ease', stiffness: 250, duration: 0.2}}
          className="min-w-[calc((36_/_28)_*_5rem)] w-[calc((36_/_28)_*_16vw)] max-w-36"
        >
          <Gucci />
        </motion.div>
        <motion.div
          whileHover={{scale: 1.1}}
          transition={{type: 'ease', stiffness: 250, duration: 0.2}}
          className="min-w-[calc((40_/_28)_*_5rem)] w-[calc((40_/_28)_*_16vw)] max-w-40"
        >
          <LouisVuitton />
        </motion.div>
        <motion.div
          whileHover={{scale: 1.1}}
          transition={{type: 'ease', stiffness: 250, duration: 0.2}}
          className="min-w-[calc((28_/_28)_*_5rem)] w-[calc((28_/_28)_*_16vw)] max-w-28"
        >
          <Zara />
        </motion.div>
        <motion.div
          whileHover={{scale: 1.1}}
          transition={{type: 'ease', stiffness: 250, duration: 0.2}}
          className="min-w-[calc((32_/_28)_*_5rem)] w-[calc((32_/_28)_*_16vw)] max-w-32"
        >
          <Puma />
        </motion.div>
        <motion.div
          whileHover={{scale: 1.1}}
          transition={{type: 'ease', stiffness: 250, duration: 0.2}}
          className="min-w-[calc((28_/_28)_*_5rem)] w-[calc((28_/_28)_*_16vw)] max-w-28"
        >
          <Adidas />
        </motion.div>
        <motion.div
          whileHover={{scale: 1.1}}
          transition={{type: 'ease', stiffness: 250, duration: 0.2}}
          className="min-w-[calc((16_/_28)_*_5rem)] w-[calc((16_/_28)_*_16vw)] max-w-16"
        >
          <Apple />
        </motion.div>
      </div>
    </section>
  )
})