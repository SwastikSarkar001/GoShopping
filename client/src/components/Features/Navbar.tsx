import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggler from '../Utilities/ThemeToggler'
import { motion, AnimationControls, TargetAndTransition, VariantLabels } from 'framer-motion'
import AuthenticateBtn from '../Utilities/AuthenticateBtn'

type NavbarProps = {
  animate?: boolean | AnimationControls | TargetAndTransition | VariantLabels | undefined
}

export default forwardRef<HTMLDivElement, NavbarProps>(function Navbar(props, ref) {
  return (
    <motion.nav ref={ref} animate={props.animate} className='sticky top-0 w-full text-text bg-background border-b-2 border-[#808080] z-100 px-8 py-4 flex items-center'>
      <Link to='/' className='font-source-serif text-4xl font-bold'>
        eazzyBizz
      </Link>
      <ThemeToggler className='ml-auto' />
      <AuthenticateBtn />
    </motion.nav>
  )
})