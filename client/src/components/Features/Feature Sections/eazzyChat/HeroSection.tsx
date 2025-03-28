import { Link } from "react-router-dom";
import ChatappSVG from "./ChatappSVG"
import { FaArrowRightLong } from "react-icons/fa6";
import { ColorSchemeType } from "../../Feature";

export default function HeroSection({ colorScheme }: { colorScheme: ColorSchemeType }) {
  return (
    <section className={`h-screen ${ colorScheme.bgGrad } text-white flex gap-8 lg:gap-16 px-[8%]`}>
      <div className="md:w-[50%] h-full flex flex-col gap-8 justify-center">
        <h1 className="text-6xl font-extrabold font-source-serif mb-8">eazzyChat</h1>
        <div>
          <p className="text-3xl">
            Effortless Communication for Businesses, Anytime, Anywhere
          </p>
          <p className="mt-2 text-[#ddd]">Communication without the cost. Just sign up and start chatting!</p>
        </div>
        <Link
          to='/auth'
          className={`px-6 py-3 rounded-lg w-max font-semibold flex transition-all items-center gap-2 border-2 border-white bg-white ${ colorScheme.text } shadow-md shadow-black/20 hover:scale-105 ${ colorScheme.bgHover } hover:text-white hover:shadow-lg hover:shadow-black/30 active:scale-90 active:shadow-xs active:shadow-black/10`}
        >
          <p>Try eazzyChat Now</p>
          <FaArrowRightLong />
        </Link>
      </div>
      <div className="hidden md:block w-1/2">
        <ChatappSVG />
      </div>
    </section>
  )
}
