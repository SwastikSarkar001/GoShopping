import { Link } from "react-router-dom";
import CRMAppSVG from "./CRMAppSVG"
import { FaArrowRightLong } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CRMComponentProps } from "./CRMApp";

export default function HeroSection({ colorScheme, isAuthenticated, componentNumber }: CRMComponentProps) {
  const startTrial = () => {
    
  }
  
  const components = [
    <button
      disabled
      className={`disabled:grayscale disabled:cursor-not-allowed px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-4 border-2 border-white disabled:border-gray-200 bg-white disabled:bg-gray-200 ${ colorScheme.text } shadow-md shadow-black/20`}
    >
      <p>Please Wait</p>
      <AiOutlineLoading3Quarters className="animate-spin stroke-15" />
    </button>,
    <>
      <Link
        to="/plans"
        role='button'
        className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white ${ colorScheme.text } shadow-md shadow-black/20 hover:scale-105 ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
      >
        <p>Buy eazzyCRM Now</p>
        <FaArrowRightLong />
      </Link>
      <button
        onClick={startTrial}
        className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white ${ colorScheme.bg } text-white shadow-md shadow-black/20 hover:scale-105 hover:bg-white hover:${ colorScheme.text } hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
      >
        <p>Start Free Trial</p>
        <FaArrowRightLong />
      </button>
    </>,
    <>
      <Link
        to="/plans"
        role='button'
        className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white ${ colorScheme.text } shadow-md shadow-black/20 hover:scale-105 ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
      >
        <p>Upgrade to a Higher Plan</p>
        <FaArrowRightLong />
      </Link>
      <button
        className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white ${ colorScheme.bg } text-white shadow-md shadow-black/20 hover:scale-105 hover:bg-white hover:${ colorScheme.text } hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
      >
        <p>View Dashboard</p>
        <FaArrowRightLong />
      </button>
    </>,
    <>
      <Link
        to="/plans"
        role='button'
        className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white ${ colorScheme.text } shadow-md shadow-black/20 hover:scale-105 ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
      >
        <p>Upgrade to a Higher Plan</p>
        <FaArrowRightLong />
      </Link>
      <button
        disabled
        className={`disabled:grayscale disabled:cursor-not-allowed px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-4 border-2 border-white disabled:border-gray-200 bg-white disabled:bg-gray-200 ${ colorScheme.text } shadow-md shadow-black/20`}
      >
        <p>Please Wait</p>
        <AiOutlineLoading3Quarters className="animate-spin stroke-15" />
      </button>
    </>,
    <Link
      to="/plans"
      role='button'
      className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white ${ colorScheme.text } shadow-md shadow-black/20 hover:scale-105 ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
    >
      <p>Buy Now for Full Access</p>
      <FaArrowRightLong />
    </Link>,
    <Link
      to="/plans"
      role='button'
      className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white ${ colorScheme.text } shadow-md shadow-black/20 hover:scale-105 ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
    >
      <p>Upgrade Now for Full Access</p>
      <FaArrowRightLong />
    </Link>,
    <div className={`grayscale cursor-not-allowed px-6 py-3 rounded-lg w-max font-semibold transition-all border-2 border-gray-200 bg-gray-200 ${ colorScheme.text } shadow-md shadow-black/20`}>
      Server Error
    </div>
  ]
  
  return (
    <section className={`h-screen ${ colorScheme.bgGrad } text-white flex gap-8 lg:gap-16 px-[8%]`}>
      <div className="md:w-[50%] h-full flex flex-col gap-8 justify-center">
        <h1 className="text-6xl font-extrabold font-source-serif mb-8">eazzyCRM</h1>
        <div>
          <p className="text-3xl">
          Empower Your Sales with Premium CRM Excellence
          </p>
          <p className="mt-2 text-[#ddd]">Experience a transformative CRM solution that empowers your sales team and enhances customer engagement with cutting-edge features designed for modern businesses.</p>
        </div>
        <div className="flex gap-4">
          {
            isAuthenticated ? (
              components[componentNumber]
            ) : (
              <Link
                to='/auth'
                role="button"
                className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white ${ colorScheme.text } shadow-md shadow-black/20 hover:scale-105 ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
              >
                <p>Login to continue</p>
                <svg viewBox="0 0 512 512" className='w-[1em]' fill='currentColor'>
                  <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                </svg>
              </Link>
            )
          }
        </div>
      </div>
      <div className="hidden md:block w-1/2">
        <CRMAppSVG />
      </div>
    </section>
  )
}
