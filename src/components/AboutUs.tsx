import AboutLanding from "../logos/AboutLanding"
import { useNavbarHeight } from '../contexts/NavbarHeightContext'
import { forwardRef, useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { emptyProps, messagesType, messageType } from "../types"

const details: messagesType = [
  {
    heading: "Heading 1",
    description: "Description 1"
  },
  {
    heading: "Heading 2",
    description: "Description 2"
  },
  {
    heading: "Heading 3",
    description: "Description 3"
  },
  {
    heading: "Heading 4",
    description: "Description 4"
  },
  {
    heading: "Heading 5",
    description: "Description 5"
  },
]

export default forwardRef<HTMLDivElement, emptyProps>(function AboutUs(props, ref) {
  const { height: navbarHeight } = useNavbarHeight()
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001
  })
  return (
    <section id='about' ref={ref} style={{height: `calc(${details.length} * 100vh)`}} className="relative text-text">
      {/* This is the background */}
      <div id='background-about' className="sticky top-0 h-screen -z-50">
        <div style={{paddingTop: navbarHeight+'px'}} className="hidden w-1/2 h-full md:flex flex-col items-center justify-center">
          <h1 className="section-header">
            About Us
          </h1>
          <AboutLanding />
        </div>
        <figure className="hidden md:block absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 100 100">
            <circle
              cx={50}
              cy={50}
              r={30}
              pathLength={1}
              strokeWidth='5%'
              fill='none'
              className="stroke-text"
              opacity={0.2}
            />
            <circle
              cx={50}
              cy={50}
              r={10}
              className="fill-text"
            />
            <motion.circle
              cx={50}
              cy={50}
              r={30}
              pathLength={0}
              strokeWidth='5%'
              style={{pathLength: progress}}
              fill='none'
              className='fill-none stroke-text'
              strokeLinejoin='round'
              strokeDashoffset='1px'
            />
          </svg>
        </figure>
      </div>

      {/* This is the divider */}
      <div ref={sectionRef} className="hidden md:block absolute inset-y-[50vh] left-1/2 -translate-x-1/2 w-1 rounded-full bg-text/20 z-50"></div>

      {/* This is the details */}
      <div id='details-about' className="absolute inset-0 min-h-screen flex flex-col md:flex-row justify-center md:justify-end">
        <h1 className="block md:hidden section-header">About Us</h1>
        <div className="md:w-1/2">
          {
            details.map((aboutdata, index) => {
              return (
                <AboutCard key={index} {...aboutdata} />
              )
            })
          }
        </div>
      </div>
    </section>
  )
})

function AboutCard(props: messageType) {
  const ref = useRef<HTMLDivElement>(null)
  const [isCentered, setIsCentered] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 50%"]
  })
  useEffect(() => {
    return scrollYProgress.on('change', (progress => {
      // Add class when scrollYProgress is in the tracking range
      if (progress > 0 && progress < 1) setIsCentered(true)
      else setIsCentered(false)
    }))
  }, [scrollYProgress]);
  return (
    <div className={`card-section relative h-screen flex items-center justify-center`}>
      <div ref={ref}
        className={`relative w-[25vw] max-w-[200px] aspect-[2/3] before:absolute after:absolute before:content-[''] after:content-[''] before:inset-0 after:inset-0 before:-z-20 after:-z-30 before:bg-sky-400 after:bg-sky-400 before:rounded-2xl after:rounded-2xl before:transition-all after:transition-all ${isCentered ? 'inview' : ''}`}
      >
        <div className="size-full bg-background flex items-center justify-center flex-col border-2 border-text rounded-2xl transition-all">
          <h1 className="text-[3vw] text-center">{props.heading}</h1>
          <div className="text-center">{props.description}</div>
        </div>
      </div>
    </div>
  )
}