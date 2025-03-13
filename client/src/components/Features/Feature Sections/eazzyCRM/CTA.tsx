import CTASvg from "./CTASvg"
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="bg-linear-to-r from-emerald-600 to-green-900 text-white py-16 px-8 md:px-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-16 justify-center md:justify-between">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-source-serif font-bold mb-4">
            Revolutionize Your Customer Relationships
          </h2>
          <p className="text-lg mb-6">
          eazzyCRM empowers your sales and support teams with a 360° view of your customers, helping you drive growth and improve engagement.
          </p>
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <Link
              to="/auth"
              className="bg-white border-2 border-white text-emerald-700 font-semibold px-6 py-3 rounded-md shadow-md hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4"
            >
              Get This Product
            </Link>
            <Link
              to="/auth"
              className="bg-emerald-600 border-2 border-white text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-white hover:text-emerald-600 hover:shadow-lg hover:scale-105 active:scale-90 transition-all mb-4 md:mb-0 md:mr-4"
            >
              Start Free Trial
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
