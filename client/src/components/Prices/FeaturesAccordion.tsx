import { useState } from "react"
import details from "../Features/FeatureDetails"
import { useAppSelector } from "../../states/store"

type FeaturesAccordionProps = {
  checkedFeatures: { [key: string]: boolean }
  selectFeatures: (key: string) => void
}

export default function FeaturesAccordion(props: FeaturesAccordionProps) {
  const [openIndex, setOpenIndex] = useState<boolean>(false)
  const toggleAccordion = () => {
    setOpenIndex(prev => !prev)
  }

  const theme = useAppSelector(state => state.theme.theme)

  return (
    <div className="md:mx-32 mt-4">
      <div className="border-y transition-all">
        <div
          className={`transition-colors flex items-center justify-between gap-2 p-4 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${openIndex ? theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100' : ''}`}
          onClick={() => toggleAccordion()}
        >
          <h2 className="text-lg font-semibold text-text">
            Select Apps to Customize Pricing
          </h2>
          <svg
            className={`w-5 h-5 stroke-text transition-transform ${openIndex ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 7l7 7 7-7" />
          </svg>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openIndex ? 'max-h-[1000px]' : 'max-h-0'
          }`}
        >
          <div className="p-4 pb-12 md:pb-4">
            <div className="flex gap-4 px-4 py-8 md:p-4 md:pt-0 flex-wrap">
              <button
                onClick={() => details.map(detail => (props.checkedFeatures[detail.featureID]) || props.selectFeatures(detail.featureID))}
                className="w-full md:w-max select-none font-source-serif text-lg bg-cyan-400 px-4 py-2 rounded-xl shadow-md text-black [&:not(:disabled):hover]:shadow-lg [&:not(:disabled):hover]:bg-cyan-300 [&:not(:disabled):active]:shadow-sm [&:not(:disabled):active]:bg-cyan-500 [&:not(:disabled):active]:scale-90 transition-all disabled:cursor-not-allowed disabled:grayscale"
                disabled={details.filter(detail => props.checkedFeatures[detail.featureID]).length === details.length}
              >
                Select All Features
              </button>
              <button
                onClick={() => details.map(detail => (props.checkedFeatures[detail.featureID]) && props.selectFeatures(detail.featureID))}
                className="w-full md:w-max select-none font-source-serif text-lg bg-cyan-400 px-4 py-2 rounded-xl shadow-md text-black [&:not(:disabled):hover]:shadow-lg [&:not(:disabled):hover]:bg-cyan-300 [&:not(:disabled):active]:shadow-sm [&:not(:disabled):active]:bg-cyan-500 [&:not(:disabled):active]:scale-90 transition-all disabled:cursor-not-allowed disabled:grayscale"
                disabled={details.filter(detail => props.checkedFeatures[detail.featureID]).length === 0}
              >
                Deselect All Features
              </button>
            </div>
            <div className="px-4 grid md:grid-cols-2 gap-4 relative">
              {
                details.map((detail, index) => (
                  <label
                    key={index}
                    htmlFor={detail.featureID}
                    className={`transition-all flex flex-col items-center justify-center select-none ${openIndex ? 'pointer-events-auto' : 'pointer-events-none'} bg-gray-200 [&:has(input:checked)]:bg-cyan-400 py-4 px-4 lg:px-8 cursor-pointer [&:has(input:focus-visible:not(checked))]:bg-gray-300 [&:has(input:focus-visible:checked)]:bg-cyan-500 [&:has(input:focus-visible)]:scale-[1.02] hover:bg-gray-300 [&:hover:has(input:checked)]:bg-cyan-500 hover:scale-[1.02] active:scale-[0.98]`}
                    onClick={() => props.selectFeatures(detail.featureID)}
                    // onContextMenu={(e) => {e.preventDefault(); console.log(detail.description)}}
                  >
                    <input
                      type="checkbox"
                      name="plans"
                      checked={props.checkedFeatures[detail.featureID]}
                      onChange={() => props.selectFeatures(detail.featureID)}
                      id={detail.featureID}
                      className="absolute scale-0 opacity-0 -z-50"
                    />
                    <p className="text-center max-w-full break-words hyphens-auto">{detail.title}</p>
                  </label>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}