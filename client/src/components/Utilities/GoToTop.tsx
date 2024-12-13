import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { BsArrowUp } from "react-icons/bs"
import { scrollable } from "../../types"

export default function GoToTop(props: scrollable) {
  const controls = useAnimation()
  const goToTop = () => {
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    controls.start({
      opacity: props.scrolled ? 1 : 0,
      pointerEvents: props.scrolled ? "all" : "none",
      transition: {duration: 0.15}
    })
  }, [props.scrolled, controls])

  return (
    <motion.div
      className="fixed z-50 select-none opacity-0 cursor-pointer bottom-10 right-10 lg:bottom-20 lg:right-20 aspect-square text-text text-3xl md:text-4xl bg-background border-text border-2 p-4 rounded-full before:content-['Go_to_top'] before:absolute before:pointer-events-none before:-z-10 before:transition-all before:delay-0 before:hover:delay-1000 before:opacity-0 before:scale-0 before:hover:opacity-100 before:hover:scale-100 before:top-0 before:hover:-top-12 before:left-1/2 before:-translate-x-1/2 before:text-sm before:w-max before:px-2 before:py-1 before:bg-background before:border-2 before:border-text"
      animate={controls}
      whileHover={{
        scale: 1.2,
        transition: {type: 'spring', stiffness: 300}
      }}
      onClick={goToTop}
    >
      <BsArrowUp />
    </motion.div>
  )
}
