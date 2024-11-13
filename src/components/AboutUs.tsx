import { forwardRef, useEffect, useRef } from "react"
import { motion, useAnimate, useScroll, useSpring } from "framer-motion"
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
    <section id='about' ref={ref} style={{height: `calc(${details.length} * 100vh)`}} className="relative text-white">
      {/* This is the background */}
      <div id='background-about' className="sticky top-0 h-screen -z-50">
        <div className="w-1/2 h-full flex items-center justify-center">
          <h1 className="section-header">
            About Us
          </h1>
        </div>
        <figure className="absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 100 100">
          <circle
            cx={50}
            cy={50}
            r={30}
            pathLength={1}
            strokeWidth='5%'
            fill='none'
            stroke='#fff'
            opacity={0.2}
          />
          <circle
            cx={50}
            cy={50}
            r={10}
            fill="white"
          />
          <motion.circle
            cx={50}
            cy={50}
            r={30}
            pathLength={0}
            strokeWidth='5%'
            style={{pathLength: progress}}
            fill='none'
            className='fill-none stroke-white'
            strokeLinejoin='round'
            strokeDashoffset='1px'
          />
        </svg>
      </figure>
      </div>

      {/* This is the divider */}
      <div ref={sectionRef} className="absolute inset-y-[50vh] left-1/2 -translate-x-1/2 w-1 rounded-full bg-white/20 z-50"></div>

      {/* This is the details */}
      <div id='details-about' className="absolute inset-0 min-h-screen flex justify-end">
        <div className="w-1/2">
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
  
  // const controls = useAnimate()
  // useEffect(() => {
  //   contro
  // })
  return (
    // <div className="card-section h-screen border-2 flex items-center justify-center border-green-700">
    <div className="card-section relative h-screen flex items-center justify-center">
      {/* <div className="card relative w-[200px] aspect-[2/3] flex items-center justify-center flex-col border-2 border-red-700"> */}
      <div
        className="group/card relative size-max before:absolute after:absolute before:content-[''] after:content-[''] before:inset-0 after:inset-0 before:opacity-0 after:opacity-0 before:-z-20 after:-z-30 before:bg-sky-400 after:bg-sky-400 before:rounded-2xl after:rounded-2xl before:translate-x-0 before:translate-y-0 after:translate-x-0 after:translate-y-0 hover:before:-translate-x-8 hover:before:translate-y-8 hover:after:translate-x-8 hover:after:-translate-y-8 hover:before:opacity-100 hover:after:opacity-100 before:transition-all after:transition-all"
      >
        <div className="w-[200px] aspect-[2/3] flex items-center justify-center flex-col border-2 border-white rounded-2xl group-hover/card:scale-110 group-hover/card:text-black group-hover/card:bg-sky-200 group-hover/card:border-sky-200 transition-all">
          <h1 className="text-[3vw] text-center">{props.heading}</h1>
          <div className="text-center">{props.description}</div>
        </div>
      </div>
    </div>
  )
}