import { useState } from "react"
import details from "../Features/FeatureDetails"
import { useAppSelector } from "../../states/store"

type FeaturesAccordionProps = {
  checkedFeatures: { [key: string]: boolean }
  selectFeatures: (key: string) => void
}

export default function FeaturesAccordion(props: FeaturesAccordionProps) {
  const theme = useAppSelector(state => state.theme.theme)

  return (
    <div className="md:mx-32">
      <div className="transition-all">
        <div className='transition-colors flex items-center justify-between gap-2 p-4'>
        </div>
        <div className="m-8 text-text font-source-serif text-4xl text-center">
          Select the apps you want to use in your platform
        </div>
        <div className="px-4 flex flex-col items-stretch gap-4 relative">
          <AddFeature />
        </div>
      </div>
    </div>
  )
}

function AddFeature() {
  const [openFeatures, setOpenFeatures] = useState<boolean>(false)
  const toggleOpenFeatures = () => {
    setOpenFeatures(prev => !prev)
  }
  return (
    <div className="relative focus-visible:outline-2 rounded-3xl border-2 border-transparent hover:border-gray-400" tabIndex={0}>
      <div className="py-4 px-8 rounded-2xl flex gap-4 items-center cursor-pointer bg-gray-300/20 text-gray-500 w-full" onClick={toggleOpenFeatures}>
        <div className="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <div className="">
          Click to add a feature
        </div>
      </div>
      {
        openFeatures &&
        <div className="absolute overflow-auto max-w-[40%] max-h-80 z-10 top-full bg-background border border-gray-300 shadow-lg rounded-md mt-2 p-4">
          <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {
              details.map(feature => (
                  <div key={feature.featureID} className="text-text p-2 hover:bg-gray-300/20 rounded-md cursor-pointer transition-colors">
                    <div className="font-bold">{feature.title}</div>
                    <div className="text-sm text-gray-500">{feature.description}</div>
                  </div>
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}