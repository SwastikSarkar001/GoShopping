import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion'

type navbar = {
	scrolled: boolean
}

export default function Navbar(props: navbar) {
  const controls = useAnimation();

  // Animate background color based on scroll position
  useEffect(() => {
    controls.start({
      backgroundColor: props.scrolled ? '#030711ff' : '#03071100',
      transition: { duration: 0.2 },
    });
  }, [props.scrolled, controls]);

  return (
    <motion.nav animate={controls} className="flex items-center justify-between fixed z-50 top-0 left-0 right-0 text-white px-8 py-4 select-none">
			<motion.a
				href='/'
				whileHover={{
					scale: 1.05,
				}}
				whileTap={{
					scale: 0.9
				}}
				className="font-source-serif text-4xl font-bold"
			>
				GoShopping
			</motion.a>
			<div className="flex items-center gap-8 px-8">
				<div className="text-xl py-2 hover:scale-110 transition-transform cursor-pointer">Home</div>
				<div className="text-xl py-2 hover:scale-110 transition-transform cursor-pointer">About Us</div>
				<div className="text-xl py-2 hover:scale-110 transition-transform cursor-pointer">Our Products</div>
				<div className="text-xl py-2 hover:scale-110 transition-transform cursor-pointer">Latest Models</div>
				<div className="text-xl py-2 hover:scale-110 transition-transform cursor-pointer">Contact Us</div>
			</div>
			<SignInBtn />
    </motion.nav>
  )
}

function SignInBtn() {
	return(
		<motion.button
			whileTap={{scale: 0.9}}
			className=" p-4 bg-slate-100 text-black border-background border-[1px] border-solid hover:bg-background hover:text-white hover:border-white transition-colors duration-300"
		>
			Login In or Sign Up
		</motion.button>
	)
}