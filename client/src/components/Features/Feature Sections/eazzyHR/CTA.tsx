import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HRComponentProps } from "./HRApp";
import CTASvg from "./CTASvg"
import { Link } from 'react-router-dom'

export default function CTA({ colorScheme, isAuthenticated, componentNumber }: HRComponentProps) {
  const startTrial = () => {

  }
  
  const components = [
    <button
      disabled
      className={`disabled:grayscale disabled:cursor-not-allowed px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-4 border-2 border-white disabled:border-gray-200 bg-white disabled:bg-gray-200 ${ colorScheme.text} shadow-md shadow-black/20`}
    >
      <p>Please Wait</p>
      <AiOutlineLoading3Quarters className="animate-spin stroke-15" />
    </button>,
    <>
      <Link
        to="/plans"
        role="button"
        className={`bg-white border-2 border-white ${ colorScheme.text } font-semibold px-6 py-3 rounded-md shadow-md ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
      >
        Get This Product
      </Link>
      <button
        onClick={startTrial}
        className={`${ colorScheme.bg } border-2 border-white text-white ${ colorScheme.textHover } font-semibold px-6 py-3 rounded-md shadow-md hover:bg-white ${ colorScheme.text } hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
      >
        Start Free Trial
      </button>
    </>,
    <>
      <Link
        to="/plans"
        role='button'
        className={`bg-white border-2 border-white ${ colorScheme.text } font-semibold px-6 py-3 rounded-md shadow-md ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
      >
        Upgrade to a Higher Plan
      </Link>
      <button
        className={`${ colorScheme.bg } border-2 border-white text-white ${ colorScheme.textHover } font-semibold px-6 py-3 rounded-md shadow-md hover:bg-white ${ colorScheme.text } hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
      >
        View Dashboard
      </button>
    </>,
    <>
      <Link
        to="/plans"
        role='button'
        className={`bg-white border-2 border-white ${ colorScheme.text } font-semibold px-6 py-3 rounded-md shadow-md ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
      >
        Upgrade to a Higher Plan
      </Link>
      <button
        disabled
        className={`disabled:grayscale disabled:cursor-not-allowed px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-4 border-2 border-white disabled:border-gray-200 bg-white disabled:bg-gray-200 ${ colorScheme.text} shadow-md shadow-black/20`}
      >
        <p>Please Wait</p>
        <AiOutlineLoading3Quarters className="animate-spin stroke-15" />
      </button>
    </>,
    <Link
      to="/plans"
      role='button'
      className={`bg-white border-2 border-white ${ colorScheme.text } font-semibold px-6 py-3 rounded-md shadow-md ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
    >
      Buy Now for Full Access
    </Link>,
    <Link
      to="/plans"
      role='button'
      className={`bg-white border-2 border-white ${ colorScheme.text } font-semibold px-6 py-3 rounded-md shadow-md ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
    >
      Upgrade Now for Full Access
    </Link>,
    <div className={`grayscale cursor-not-allowed px-6 py-3 rounded-lg w-max font-semibold transition-all border-2 border-gray-200 bg-gray-200 ${ colorScheme.text } shadow-md shadow-black/20`}>
      Server Error
    </div>
  ]

  return (
    <section className={`${ colorScheme.bgGrad } text-white py-16 px-8 md:px-16`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-16 justify-center md:justify-between">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-source-serif font-bold mb-4">
            Optimize Your HR Processes with eazzyHR
          </h2>
          <p className="text-lg mb-6">
            Automate payroll, manage employee attendance, and streamline hiring to empower your HR team and boost organizational efficiency.
          </p>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {
              isAuthenticated ? (
                components[componentNumber]
              ) : (
                <Link
                  to="/auth"
                  role="button"
                  className={`bg-white border-2 border-white ${ colorScheme.text } font-semibold px-6 py-3 rounded-md shadow-md ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
                >
                  Get Started for Free
                </Link>
              )
            }
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/2 md:max-w-[500px] mt-8 md:mt-0">
          <CTASvg />
        </div>
      </div>
    </section>
  )
}
