import { Link } from "react-router-dom";
import CRMAppSVG from "./CRMAppSVG"
import { FaArrowRightLong } from "react-icons/fa6";

export default function HeroSection() {
  return (
    <section className="h-screen bg-linear-to-r from-emerald-600 to-green-900 text-white flex gap-8 lg:gap-16 px-[8%]">
      <div className="md:w-[50%] h-full flex flex-col gap-8 justify-center">
        <h1 className="text-6xl font-extrabold font-source-serif mb-8">eazzyCRM</h1>
        <div>
          <p className="text-3xl">
          Empower Your Sales with Premium CRM Excellence
          </p>
          <p className="mt-2 text-[#ddd]">Experience a transformative CRM solution that empowers your sales team and enhances customer engagement with cutting-edge features designed for modern businesses.</p>
        </div>
        <Link
          to='/auth'
          className="px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white text-emerald-600 shadow-md shadow-black/20 hover:scale-105 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10"
        >
          <p>Try eazzyCRM Now</p>
          <FaArrowRightLong />
        </Link>
      </div>
      <div className="hidden md:block w-1/2">
        <CRMAppSVG />
      </div>
    </section>
  )
}
