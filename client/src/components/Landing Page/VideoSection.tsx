import videosection from '/Finalized.mp4'
import { useEffect, useState, forwardRef } from 'react'
import { emptyProps, messagesType } from '../../types'

const messages: messagesType = [
	{
		heading: 'Your All-in-One Business Solution',
		description: 'Stay ahead with eazzyBizz – the all-in-one solution for seamless business resource management.'
	},
	{
		heading: 'Smart Tools for Smarter Businesses',
		description: 'Revolutionize the way you manage your business with eazzyBizz, your partner in growth and efficiency.'
	},
	{
		heading: 'Efficiency at Your Fingertips',
		description: 'Simplify complex business processes with eazzyBizz and drive your success with ease.'
	}
]

export default forwardRef<HTMLDivElement, emptyProps>(function VideoSection(props, ref) {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			if (index < messages.length - 1)
			setIndex((prev) => prev + 1)
			else if(index === messages.length - 1)
			setIndex(0)
		}, 6000)
		return () => clearInterval(interval)
	}, [index])

  return (
		<section id='main' className='w-full h-screen relative flex items-end' ref={ref}>
			<video autoPlay disablePictureInPicture controlsList='nodownload' loop muted playsInline src={videosection} className="absolute size-full z-[-1] object-cover" />
			{
				messages.map((obj, ind) => {
					return (
						<div
							key={ind}
							className={`absolute pb-4 px-4 md:pb-8 md:px-8 lg:pb-16 lg:pl-16 text-slate-100 md:w-3/5 video-description ${(ind === index) ? 'appear' : ''}`}
						>
							<h1 className='video-section-header font-noto-serif'>{obj.heading}</h1>
							<p className='video-section-description'>{obj.description}</p>
						</div>
					)
				})
			}
		</section>
  )
})
