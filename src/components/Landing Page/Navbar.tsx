import { useEffect, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { navbar } from '../../types'
import sectionsInfo from './sectiondata'
import { large } from '../../../windowSizes'
import ThemeToggler from '../ThemeToggler'
import { useTheme } from '../../contexts/ThemeContext'
import { Link } from 'react-router-dom'

export default function Navbar(props: navbar) {
	const { theme } = useTheme()

	/* Tracking options box on different screens */
	const [optionsClicked, setOptionsClicked] = useState(false)  // By default it is hidden
	const toggleOptions = () => {
		setOptionsClicked((prev) => !prev)
	}
	// On window width size greater than or equal to 1100px the options box will be hidden automatically
	window.onresize = () => window.innerWidth >= large.value && setOptionsClicked(false)
	
	/* For filling background */
	const controls = useAnimation();
	useEffect(() => {
		controls.start({
			borderColor: (props.scrolled || optionsClicked) ? '#808080ff' : '#80808000',
			backgroundColor: (theme === 'dark') ? (props.scrolled || optionsClicked) ? '#030711ff' : '#03071100' : (props.scrolled || optionsClicked) ? '#fcf8eeff' : '#fcf8ee00',
			transition: { duration: 0.2 },
		});
	}, [props.scrolled, optionsClicked, controls, theme])

	/* Scroll to the element */
	const largeScreenRefs: React.RefObject<HTMLDivElement>[] = Array.from({ length: sectionsInfo.length }, () => useRef<HTMLDivElement>(null))
	useEffect(() => {
		largeScreenRefs.forEach((ref, index) => {
			if (ref.current != null) {
				ref.current.onclick = () => {
					props.sectionRefs[index].current?.scrollIntoView({
						behavior: 'smooth'
					})
				}
			}
		})
	})

	/* On clicking sign in button this function will trigger */
	const registerFn = () => {
		// Write code here
		console.log('Hello everybody!')
	}

	return (
		<motion.nav id='navbar' animate={controls} className={`flex transition-colors items-center justify-between fixed z-[100] top-0 left-0 right-0 ${(props.scrolled || optionsClicked) ? 'text-text' : 'text-white'} px-8 py-4 select-none border-b-2 border-transparent`}>
			<motion.div
				whileHover={{
					scale: 1.05,
				}}
				whileTap={{
					scale: 0.9
				}}
			>
				<Link to='/' className='font-source-serif text-4xl font-bold'>
					eazzyBizz
				</Link>
			</motion.div>
			<div className="hidden lg:flex lg:items-center lg:gap-8 lg:px-8 lg:ml-auto">
				{
					sectionsInfo.map((section, index) => {
						return (
							<motion.div
								whileTap={{scale: 0.9, transition: {duration: 0.1}}}
								whileHover={{scale: 1.1, transition: {duration: 0.1}}}
								ref={largeScreenRefs[index]}
								key={index}
								className="text-xl py-2 transition-transform cursor-pointer"
							>
								{section.name}
							</motion.div>
						)
					})
				}
			</div>
			<ThemeToggler />
			<RegisterBtn registerFn={registerFn} />
			<div
				className='block lg:hidden text-2xl cursor-pointer hover:scale-110 transition-transform'
				onClick={toggleOptions}
			>
				<Hamburger scrolled={props.scrolled} optionsClicked={optionsClicked} />
			</div>
			<MediumScreenOpts clicked={optionsClicked} setClicked={toggleOptions} sectionRefs={props.sectionRefs} />
		</motion.nav>
	)
}

type hambrgrType = {
	scrolled: boolean,
	optionsClicked: boolean
}

function Hamburger(props: hambrgrType) {
	return (
		<svg id="hamburger" className={props.optionsClicked ? 'closed' : ''} width='1em' height='1em' viewBox="10 0 50 40">
			<g className={(props.scrolled || props.optionsClicked) ? 'stroke-text' : 'stroke-white'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
				<path id="top-line" d="M10,10 L50,10 Z"></path>
				<path id="middle-line" d="M10,20 L50,20 Z"></path>
				<path id="bottom-line" d="M10,30 L50,30 Z"></path>
			</g>
		</svg>
	)
}

type registerProp = {
	registerFn: () => void
}

function RegisterBtn(props: registerProp) {
	return (
		<motion.button
			whileTap={{ scale: 0.9 }}
			onClick={props.registerFn}
		>
			<Link to='/features' className='hidden md:block px-4 py-2 lg:p-4 lg:ml-0 mx-[5%] lg:mr-0 bg-slate-100 text-black border-black border-[1px] border-solid hover:bg-black hover:text-white hover:border-white transition-colors duration-300 capitalize'>
				Get Started
			</Link>
		</motion.button>
	)
}

type msopts = {
	clicked: boolean,
	setClicked: () => void
	sectionRefs: React.RefObject<HTMLDivElement>[],
}

function MediumScreenOpts(props: msopts) {
	const { theme, toggleTheme } = useTheme()
	const mediumScreenRefs: React.RefObject<HTMLDivElement>[] = Array.from({ length: sectionsInfo.length }, () => useRef<HTMLDivElement>(null))

	mediumScreenRefs.forEach((ref, index) => {
		if (ref.current != null) {
			ref.current.onclick = () => {
				props.sectionRefs[index].current?.scrollIntoView({
					behavior: 'smooth'
				})
				props.setClicked()
			}
		}
	})

	const setTheme = () => {
		toggleTheme()
		props.setClicked()
	}

	return (
		<div className={`absolute flex flex-col gap-4 py-4 bg-background -z-20 border-y-2 border-[#808080] left-0 right-0 lg:!hidden transition-all duration-[250ms] ${props.clicked ? 'top-full opacity-100 pointer-events-auto' : 'top-0 opacity-0 pointer-events-none'}`}>
			{
				sectionsInfo.map((section, index) => {
					return (
						<motion.div
							whileTap={{scale: 0.9}}
							className='pr-4 transition-all text-lg group/medopts flex items-center overflow-hidden cursor-pointer'
							key={index}
							ref={mediumScreenRefs[index]}
						>
							<div className='flex items-center overflow-hidden'>
								<div className='-translate-x-full mx-0 transition-all group-hover/medopts:translate-x-0 group-hover/medopts:mx-4 opacity-0 group-hover/medopts:opacity-100'>→</div>
								<div className=''>{section.name}</div>
							</div>
						</motion.div>
					)
				})
			}
			<motion.div
				whileTap={{scale: 0.9}}
				className='pr-4 transition-all text-lg group/medopts flex md:hidden items-center overflow-hidden cursor-pointer'
				onClick={setTheme}
			>
				<div className='flex items-center overflow-hidden'>
					<div className='-translate-x-full mx-0 transition-all group-hover/medopts:translate-x-0 group-hover/medopts:mx-4 opacity-0 group-hover/medopts:opacity-100'>→</div>
					<div className=''>Switch to {(theme === 'dark') ? 'light' : 'dark'} mode</div>
				</div>
			</motion.div>
			<motion.div
				whileTap={{scale: 0.9}}
				onClick={props.setClicked}
			>
				<Link to='/features' className='pr-4 transition-all text-lg group/medopts flex md:hidden items-center overflow-hidden cursor-pointer'>
					<div className='flex items-center overflow-hidden'>
						<div className='-translate-x-full mx-0 transition-all group-hover/medopts:translate-x-0 group-hover/medopts:mx-4 opacity-0 group-hover/medopts:opacity-100'>→</div>
						<div className='capitalize'>Get Started</div>
					</div>
				</Link>
			</motion.div>
		</div>
	)
}