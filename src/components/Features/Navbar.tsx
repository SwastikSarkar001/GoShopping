import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggler from '../Utilities/ThemeToggler'
import { motion, AnimationControls, TargetAndTransition, VariantLabels } from 'framer-motion'

type NavbarProps = {
  animate?: boolean | AnimationControls | TargetAndTransition | VariantLabels | undefined
}

export default forwardRef<HTMLDivElement, NavbarProps>(function Navbar(props, ref) {
  return (
    <motion.nav ref={ref} animate={props.animate} className='sticky top-0 w-full text-text bg-background border-b-2 border-[#808080] z-[100] px-8 py-4 flex items-center'>
      <Link to='/' className='font-source-serif text-4xl font-bold'>
        eazzyBizz
      </Link>
      <ThemeToggler className='ml-auto' />
      <SignInBtn />
    </motion.nav>
  )
})

function SignInBtn() {
  return (
    <Link
      to='/signin'
      className="relative border-none p-[2px] rounded-full ml-4 sm:ml-8 lg:ml-16 sm:mr-[2%] cursor-pointer transition-all duration-300 shadow-[2px_2px_10px_rgba(0,_0,_0,_0.199)] bg-gradient-to-r from-cyan-500 to-blue-500 outline-0 group/signin active:scale-90 after:absolute after:inset-[2px] after:z-10 hover:after:scale-[0.4] hover:after:opacity-0 after:transition-all after:duration-300 after:rounded-full after:bg-background"
    >
      <div className='relative z-20 flex items-center py-2 px-6 gap-4 bg-transparent rounded-full transition-all duration-300'>
        <div className="w-full duration-300 flex items-center justify-center">
          <svg viewBox="0 0 512 512" className='w-[1em]'>
            <path className='fill-text group-hover/signin:fill-white duration-300' d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
          </svg>
        </div>
        <div className="text-text group-hover/signin:text-white text-[1.2em] font-[600] duration-300">Login</div>
      </div>
    </Link>
  )
}