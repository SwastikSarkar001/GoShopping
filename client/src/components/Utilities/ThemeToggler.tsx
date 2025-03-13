import { useRef, useEffect, HTMLProps } from 'react'
import { useAppDispatch, useAppSelector } from '../../states/store'
import { toggleTheme } from '../../states/reducers/themeSlice'

type togglerProps = {
	className?: HTMLProps<HTMLElement>['className']
	disableTooltip?: boolean
}

/**
 * ThemeToggler component allows users to toggle between light and dark themes.
 * It uses a checkbox input to switch themes and displays a tooltip on hover.
 */
export default function ThemeToggler({ className, disableTooltip = false }: togglerProps) {
	const toggleRef = useRef<HTMLInputElement>(null)
	const theme = useAppSelector(state => state.theme.theme)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (theme === 'dark') {
			if (toggleRef.current !== null) toggleRef.current.checked = true
		} else {
			if (toggleRef.current !== null) toggleRef.current.checked = false
		}
	}, [theme])

	return (
		<div className={"checkbox-wrapper relative rounded-[20px] h-max group/changer " + className}>
			{
				!disableTooltip &&
				<div className='absolute w-max opacity-0 pointer-events-none text-text bg-background border-2 border-text py-1 px-2 top-0 scale-0 left-1/2 -translate-x-1/2 text-sm transition-all delay-0 group-hover/changer:top-12 group-hover/changer:scale-100 group-hover/changer:delay-500 group-hover/changer:opacity-100'>
					Switch to {(theme === 'dark') ? 'light' : 'dark'} mode
				</div>
			}
			<label className="switch">
				<input ref={toggleRef} type="checkbox" onClick={() => dispatch(toggleTheme())} />
				<span className="slider" />
			</label>
		</div>
	)
}