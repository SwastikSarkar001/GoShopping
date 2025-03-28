import { ColorSchemeType } from "../../Feature"
import CTASvg from "./CTASvg"
import { Link } from 'react-router-dom'

export default function CTA({ colorScheme }: { colorScheme: ColorSchemeType }) {
  return (
    <section className={`${ colorScheme.bgGrad } text-white py-16 px-8 md:px-16`}>
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-16 justify-center md:justify-between">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-source-serif font-bold mb-4">
            Transform the Way Your Team Communicates
          </h2>
          <p className="text-lg mb-6">
            eazzyChat makes business communication simple, seamless, and free. Join thousands of businesses already using it to boost collaboration.
          </p>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <Link
              to="/auth"
              className={`bg-white border-2 border-white ${ colorScheme.text } font-semibold px-6 py-3 rounded-md shadow-md ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4`}
            >
              Get Started for Free
            </Link>
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
